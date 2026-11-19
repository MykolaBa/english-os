import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { EMPTY_DRAFT } from './model'
import { STARTER_COLLECTIONS, STARTER_WORDS } from '@/content/vocabulary/starterWords'
import { seedStarterVocabulary, seedWordId } from './seed'
import {
  addWord,
  createCollection,
  deleteCollection,
  deleteWord,
  DuplicateError,
  toggleFavorite,
  updateWord,
} from './wordsRepo'

const STARTER_COUNT = Object.values(STARTER_WORDS).flat().length

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('wordsRepo', () => {
  it('adds a word, logs activity and rejects duplicates ignoring case', async () => {
    const word = await addWord({ ...EMPTY_DRAFT, term: 'Deploy', translation: 'деплоїти' })
    expect(word.srs.status).toBe('new')
    expect(await db.activity.count()).toBe(1)
    await expect(
      addWord({ ...EMPTY_DRAFT, term: ' deploy ', translation: 'x' }),
    ).rejects.toBeInstanceOf(DuplicateError)
  })

  it('updates, favorites and deletes a word with its review logs', async () => {
    const word = await addWord({ ...EMPTY_DRAFT, term: 'merge', translation: 'злити' })
    await updateWord(word.id, {
      ...EMPTY_DRAFT,
      term: 'merge',
      translation: 'змерджити',
      synonyms: 'combine',
    })
    await toggleFavorite(word.id)
    let stored = await db.words.get(word.id)
    expect(stored?.translation).toBe('змерджити')
    expect(stored?.synonyms).toEqual(['combine'])
    expect(stored?.favorite).toBe(true)

    await db.reviewLogs.add({ wordId: word.id, at: 1, rating: 'good', mode: 'flashcard' })
    await deleteWord(word.id)
    stored = await db.words.get(word.id)
    expect(stored).toBeUndefined()
    expect(await db.reviewLogs.count()).toBe(0)
  })

  it('removes a deleted collection from its words', async () => {
    const collection = await createCollection('Sprint')
    await expect(createCollection(' sprint ')).rejects.toBeInstanceOf(DuplicateError)
    const word = await addWord({
      ...EMPTY_DRAFT,
      term: 'standup',
      translation: 'стендап',
      collectionIds: [collection.id],
    })
    await deleteCollection(collection.id)
    expect((await db.words.get(word.id))?.collectionIds).toEqual([])
    expect(await db.collections.count()).toBe(0)
  })
})

describe('seedStarterVocabulary', () => {
  it('imports starter content exactly once', async () => {
    expect(await seedStarterVocabulary()).toBe(STARTER_COUNT)
    expect(await seedStarterVocabulary()).toBe(0)
    expect(await db.words.count()).toBe(STARTER_COUNT)
    expect(await db.collections.count()).toBe(STARTER_COLLECTIONS.length)
  })

  it('survives concurrent calls (React StrictMode runs effects twice)', async () => {
    await Promise.all([seedStarterVocabulary(), seedStarterVocabulary()])
    expect(await db.words.count()).toBe(STARTER_COUNT)
  })

  it('does not duplicate a word the user already added', async () => {
    await addWord({ ...EMPTY_DRAFT, term: 'Deploy', translation: 'мій переклад' })
    await seedStarterVocabulary()
    expect(await db.words.count()).toBe(STARTER_COUNT)
    expect(await db.words.get(seedWordId('deploy'))).toBeUndefined()
  })

  it('has unique ids and complete translations', () => {
    const entries = Object.values(STARTER_WORDS).flat()
    expect(new Set(entries.map(([term]) => seedWordId(term))).size).toBe(entries.length)
    for (const [term, , , , translation, definition, example, exampleUk] of entries) {
      expect(
        [term, translation, definition, example, exampleUk].every((s) => s.trim().length > 0),
      ).toBe(true)
    }
  })
})

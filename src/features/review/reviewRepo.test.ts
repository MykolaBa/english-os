import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { DEFAULT_SRS_CONFIG } from '@/lib/srs/scheduler'
import { EMPTY_DRAFT } from '@/features/vocabulary/model'
import { seedStarterVocabulary } from '@/features/vocabulary/seed'
import { addWord } from '@/features/vocabulary/wordsRepo'
import { countIntroduced, getTodayLogs, MISTAKES_COLLECTION_ID, recordAnswer } from './reviewRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('recordAnswer', () => {
  it('updates the schedule, logs the review and earns XP', async () => {
    const word = await addWord({ ...EMPTY_DRAFT, term: 'merge', translation: 'злити' })
    const updated = await recordAnswer({
      wordId: word.id,
      rating: 'good',
      mode: 'flashcards',
      config: DEFAULT_SRS_CONFIG,
    })
    expect(updated.srs.status).toBe('reviewing')
    expect(updated.srs.intervalDays).toBe(3)
    const logs = await getTodayLogs()
    expect(logs).toHaveLength(1)
    expect(countIntroduced(logs)).toBe(1)
    expect(await db.activity.where('type').equals('review').count()).toBe(1)
  })

  it('adds forgotten words to "My Mistakes" once', async () => {
    await seedStarterVocabulary()
    const wordId = 'seed:word:deploy'
    await recordAnswer({ wordId, rating: 'again', mode: 'typing', config: DEFAULT_SRS_CONFIG })
    await recordAnswer({ wordId, rating: 'again', mode: 'typing', config: DEFAULT_SRS_CONFIG })
    const word = await db.words.get(wordId)
    expect(word?.collectionIds.filter((c) => c === MISTAKES_COLLECTION_ID)).toHaveLength(1)
    expect(countIntroduced(await getTodayLogs())).toBe(1) // only the first answer was "new"
  })
})

describe('practice answers', () => {
  it('earn XP and track mistakes but leave the schedule untouched', async () => {
    await seedStarterVocabulary()
    const wordId = 'seed:word:merge'
    const learned = await recordAnswer({
      wordId,
      rating: 'good',
      mode: 'flashcards',
      config: DEFAULT_SRS_CONFIG,
    })
    const after = await recordAnswer({
      wordId,
      rating: 'again',
      mode: 'flashcards',
      config: DEFAULT_SRS_CONFIG,
      practice: true,
    })
    expect(after.srs).toEqual(learned.srs)
    expect(after.collectionIds).toContain(MISTAKES_COLLECTION_ID)
    const logs = await getTodayLogs()
    expect(logs.filter((l) => l.practice)).toHaveLength(1)
    expect(await db.activity.where('type').equals('review').count()).toBe(2)
  })
})

import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { Collection, Word } from '@/lib/db/types'
import { createId } from '@/lib/id'
import { createInitialSrs, draftToFields, normalizeTerm, type WordDraft } from './model'

/** XP for adding a word: small on purpose — reviewing is what makes words stick. */
export const XP_WORD_ADDED = 2

export class DuplicateError extends Error {
  readonly value: string

  constructor(value: string) {
    super(`Duplicate: ${value}`)
    this.name = 'DuplicateError'
    this.value = value
  }
}

async function findByTerm(term: string): Promise<Word | undefined> {
  const key = normalizeTerm(term)
  return db.words.filter((w) => normalizeTerm(w.term) === key).first()
}

export async function addWord(draft: WordDraft, now = Date.now()): Promise<Word> {
  const fields = draftToFields(draft)
  if (await findByTerm(fields.term)) throw new DuplicateError(fields.term)

  const word: Word = {
    ...fields,
    id: createId(),
    favorite: false,
    source: 'user',
    createdAt: now,
    updatedAt: now,
    srs: createInitialSrs(now),
  }
  await db.words.add(word)
  await logActivity({
    type: 'word_added',
    xp: XP_WORD_ADDED,
    subject: word.term,
    refId: word.id,
    at: now,
  })
  return word
}

export async function updateWord(id: string, draft: WordDraft): Promise<void> {
  const fields = draftToFields(draft)
  const existing = await findByTerm(fields.term)
  if (existing && existing.id !== id) throw new DuplicateError(fields.term)
  await db.words.update(id, { ...fields, updatedAt: Date.now() })
}

/** Deletes the word together with its review history. */
export async function deleteWord(id: string): Promise<void> {
  await db.transaction('rw', db.words, db.reviewLogs, async () => {
    await db.reviewLogs.where('wordId').equals(id).delete()
    await db.words.delete(id)
  })
}

export async function toggleFavorite(id: string): Promise<void> {
  await db.words
    .where('id')
    .equals(id)
    .modify((w) => {
      w.favorite = !w.favorite
    })
}

export async function createCollection(name: string, description?: string): Promise<Collection> {
  const trimmed = name.trim()
  const taken = await db.collections
    .filter((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    .first()
  if (taken) throw new DuplicateError(trimmed)

  const collection: Collection = {
    id: createId(),
    name: trimmed,
    description: description?.trim() || undefined,
    icon: 'folder',
    source: 'user',
    createdAt: Date.now(),
  }
  await db.collections.add(collection)
  return collection
}

/** Removes the collection; its words stay in the vocabulary. */
export async function deleteCollection(id: string): Promise<void> {
  await db.transaction('rw', db.words, db.collections, async () => {
    await db.words
      .where('collectionIds')
      .equals(id)
      .modify((w) => {
        w.collectionIds = w.collectionIds.filter((c) => c !== id)
      })
    await db.collections.delete(id)
  })
}

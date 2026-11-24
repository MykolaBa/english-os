import { STARTER_VOCABULARY_VERSION } from '@/content/vocabulary/starterCollections'
import { db } from '@/lib/db/db'
import { isStringArray } from '@/lib/guards'
import { normalizeTerm } from './model'

export { seedCollectionId, seedWordId } from './seedIds'

const META_VERSION = 'seed.vocabulary.version'
/** Every seed id ever inserted — so words the user deleted are never re-added. */
const META_IDS = 'seed.vocabulary.ids'

const storedVersion = async () => {
  const value = (await db.meta.get(META_VERSION))?.value
  return typeof value === 'number' ? value : 0
}

/**
 * Imports starter collections and words once per content version.
 * Idempotent: safe to call on every app start (and twice in React StrictMode),
 * never duplicates, never overwrites user edits, never resurrects deleted words.
 */
export async function seedStarterVocabulary(now = Date.now()): Promise<number> {
  // The usual case — already seeded — costs one key lookup and loads no content.
  if ((await storedVersion()) >= STARTER_VOCABULARY_VERSION) return 0
  // Loaded only when needed, and before the transaction: a Dexie transaction commits as
  // soon as it awaits anything that isn't a database call (like a dynamic import).
  const { buildStarterData } = await import('./starterData')

  return db.transaction('rw', db.words, db.collections, db.meta, async () => {
    // Checked again inside: another tab (or StrictMode's second call) may have seeded.
    if ((await storedVersion()) >= STARTER_VOCABULARY_VERSION) return 0

    const storedIds = (await db.meta.get(META_IDS))?.value
    const seenIds = new Set(isStringArray(storedIds) ? storedIds : [])
    const { collections, words } = buildStarterData(now)

    const newCollections = collections.filter((c) => !seenIds.has(c.id))
    const existingTerms = new Set((await db.words.toArray()).map((w) => normalizeTerm(w.term)))
    const newWords = words.filter(
      (w) => !seenIds.has(w.id) && !existingTerms.has(normalizeTerm(w.term)),
    )

    await db.collections.bulkPut(newCollections)
    await db.words.bulkPut(newWords)

    for (const item of [...collections, ...words]) seenIds.add(item.id)
    await db.meta.bulkPut([
      { key: META_VERSION, value: STARTER_VOCABULARY_VERSION },
      { key: META_IDS, value: [...seenIds] },
    ])
    return newWords.length
  })
}

import {
  STARTER_COLLECTIONS,
  STARTER_VOCABULARY_VERSION,
  STARTER_WORDS,
} from '@/content/vocabulary/starterWords'
import { db } from '@/lib/db/db'
import { isStringArray } from '@/lib/guards'
import type { Collection, Word } from '@/lib/db/types'
import { createInitialSrs, normalizeTerm } from './model'

const META_VERSION = 'seed.vocabulary.version'
/** Every seed id ever inserted — so words the user deleted are never re-added. */
const META_IDS = 'seed.vocabulary.ids'

const slug = (text: string) =>
  normalizeTerm(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const seedCollectionId = (s: string) => `seed:collection:${s}`
export const seedWordId = (term: string) => `seed:word:${slug(term)}`

export function buildStarterData(now: number): { collections: Collection[]; words: Word[] } {
  const collections: Collection[] = STARTER_COLLECTIONS.map((c) => ({
    id: seedCollectionId(c.slug),
    name: c.name,
    description: c.description,
    icon: c.icon,
    source: 'seed',
    createdAt: now,
  }))

  let order = 0
  const words: Word[] = Object.entries(STARTER_WORDS).flatMap(([collectionSlug, entries]) =>
    entries.map(
      ([
        term,
        phonetic,
        partOfSpeech,
        level,
        translation,
        definition,
        example,
        exampleTranslation,
      ]) => {
        // Slightly different timestamps keep a stable "newest first" order.
        const createdAt = now - order++
        return {
          id: seedWordId(term),
          term,
          translation,
          definition,
          phonetic: phonetic || undefined,
          partOfSpeech,
          level,
          example,
          exampleTranslation,
          collectionIds: [seedCollectionId(collectionSlug)],
          synonyms: [],
          antonyms: [],
          collocations: [],
          favorite: false,
          source: 'seed',
          createdAt,
          updatedAt: createdAt,
          srs: createInitialSrs(createdAt),
        }
      },
    ),
  )
  return { collections, words }
}

/**
 * Imports starter collections and words once per content version.
 * Idempotent: safe to call on every app start (and twice in React StrictMode),
 * never duplicates, never overwrites user edits, never resurrects deleted words.
 */
export async function seedStarterVocabulary(now = Date.now()): Promise<number> {
  return db.transaction('rw', db.words, db.collections, db.meta, async () => {
    const storedVersion = (await db.meta.get(META_VERSION))?.value
    const version = typeof storedVersion === 'number' ? storedVersion : 0
    if (version >= STARTER_VOCABULARY_VERSION) return 0

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

import { STARTER_COLLECTIONS, STARTER_WORDS } from '@/content/vocabulary/starterWords'
import type { Collection, Word } from '@/lib/db/types'
import { createInitialSrs } from './model'
import { seedCollectionId, seedWordId } from './seedIds'

/** The starter collections and words as database rows. Loaded on demand by seed.ts. */
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

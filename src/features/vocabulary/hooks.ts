import { useLiveQuery } from 'dexie-react-hooks'
import { STARTER_COLLECTIONS } from '@/content/vocabulary/starterCollections'
import { db } from '@/lib/db/db'
import type { Collection, Word } from '@/lib/db/types'
import { normalizeTerm } from './model'
import { seedCollectionId } from './seedIds'

const STARTER_ORDER = new Map(STARTER_COLLECTIONS.map((c, i) => [seedCollectionId(c.slug), i]))

/** All words, live. `undefined` while loading. (A few thousand words filter fine in memory.) */
export function useWords(): Word[] | undefined {
  return useLiveQuery(() => db.words.toArray(), [])
}

/** Starter collections first (in their defined order), then the user's own by name. */
export function useCollections(): Collection[] | undefined {
  return useLiveQuery(async () => {
    const all = await db.collections.toArray()
    const seed = all
      .filter((c) => c.source === 'seed')
      .toSorted((a, b) => (STARTER_ORDER.get(a.id) ?? 99) - (STARTER_ORDER.get(b.id) ?? 99))
    const user = all
      .filter((c) => c.source === 'user')
      .toSorted((a, b) => a.name.localeCompare(b.name))
    return [...seed, ...user]
  }, [])
}

/** `undefined` while loading, `null` when the word doesn't exist. */
export function useWord(id: string | undefined): Word | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.words.get(id)) ?? null) : null), [id])
}

/** The learner's words by normalized term, to mark known words and avoid duplicates. */
export function useVocabularyIndex(): Map<string, Word> | undefined {
  return useLiveQuery(async () => {
    const words = await db.words.toArray()
    return new Map(words.map((w) => [normalizeTerm(w.term), w]))
  }, [])
}

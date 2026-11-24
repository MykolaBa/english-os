import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { ReadingProgress, Word } from '@/lib/db/types'
import { normalizeTerm } from '@/features/vocabulary/model'

/** Progress of every text, by id. `undefined` while loading. */
export function useReadingProgressMap(): Map<string, ReadingProgress> | undefined {
  return useLiveQuery(async () => {
    const rows = await db.readingProgress.toArray()
    return new Map(rows.map((r) => [r.textId, r]))
  }, [])
}

/** `null` when the text was never read. */
export function useReadingProgress(textId: string | undefined): ReadingProgress | null | undefined {
  return useLiveQuery(
    async () => (textId ? ((await db.readingProgress.get(textId)) ?? null) : null),
    [textId],
  )
}

/** The learner's words by normalized term, to mark known words and avoid duplicates. */
export function useVocabularyIndex(): Map<string, Word> | undefined {
  return useLiveQuery(async () => {
    const words = await db.words.toArray()
    return new Map(words.map((w) => [normalizeTerm(w.term), w]))
  }, [])
}

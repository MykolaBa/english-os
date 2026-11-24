import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { ReadingProgress } from '@/lib/db/types'

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

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { ListeningProgress } from '@/lib/db/types'

export function useListeningProgressMap(): Map<string, ListeningProgress> | undefined {
  return useLiveQuery(async () => {
    const rows = await db.listeningProgress.toArray()
    return new Map(rows.map((r) => [r.episodeId, r]))
  }, [])
}

/** `null` when the episode was never completed. */
export function useListeningProgress(id: string | undefined): ListeningProgress | null | undefined {
  return useLiveQuery(
    async () => (id ? ((await db.listeningProgress.get(id)) ?? null) : null),
    [id],
  )
}

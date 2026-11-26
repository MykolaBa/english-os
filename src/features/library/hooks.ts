import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { LibraryItem } from '@/lib/db/types'

/** All items, most recently edited first. `undefined` while loading. */
export function useLibrary(): LibraryItem[] | undefined {
  return useLiveQuery(() => db.library.orderBy('updatedAt').reverse().toArray(), [])
}

/** `undefined` while loading, `null` when it doesn't exist. */
export function useLibraryItem(id: string | undefined): LibraryItem | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.library.get(id)) ?? null) : null), [id])
}

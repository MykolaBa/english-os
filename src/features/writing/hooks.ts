import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { Writing } from '@/lib/db/types'

/** All writing, most recently edited first. `undefined` while loading. */
export function useWritings(): Writing[] | undefined {
  return useLiveQuery(() => db.writings.orderBy('updatedAt').reverse().toArray(), [])
}

/** `undefined` while loading, `null` when it doesn't exist. */
export function useWriting(id: string | undefined): Writing | null | undefined {
  return useLiveQuery(async () => (id ? ((await db.writings.get(id)) ?? null) : null), [id])
}

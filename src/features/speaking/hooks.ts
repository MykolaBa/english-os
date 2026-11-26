import { useLiveQuery } from 'dexie-react-hooks'
import type { Recording } from '@/lib/db/types'
import { recordingsByItem } from './speakingRepo'

/** Takes of these items, newest first, by item id. `undefined` while loading. */
export function useRecordings(itemIds: readonly string[]): Map<string, Recording[]> | undefined {
  const key = itemIds.join('|')
  // `key` stands for the ids: a new array with the same ids shouldn't re-query.
  return useLiveQuery(() => recordingsByItem(key ? key.split('|') : []), [key])
}

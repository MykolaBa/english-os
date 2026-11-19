import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { ReviewLog, Word } from '@/lib/db/types'
import { getTodayLogs } from './reviewRepo'

export interface ReviewData {
  words: Word[]
  todayLogs: ReviewLog[]
}

/** Everything the review overview needs, live. Both reads run in parallel. */
export function useReviewData(): ReviewData | undefined {
  return useLiveQuery(async () => {
    const [words, todayLogs] = await Promise.all([db.words.toArray(), getTodayLogs()])
    return { words, todayLogs }
  }, [])
}

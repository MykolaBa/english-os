import { logActivity } from '@/lib/activity/activityRepo'
import { startOfDay } from '@/lib/date'
import { db } from '@/lib/db/db'
import type { ReviewLog, ReviewRating, Word } from '@/lib/db/types'
import { schedule, type SrsConfig } from '@/lib/srs/scheduler'
import { seedCollectionId } from '@/features/vocabulary/seed'

/** One XP per answered card: the daily goal measures effort, not perfection. */
export const XP_PER_REVIEW = 1
export const MISTAKES_COLLECTION_ID = seedCollectionId('mistakes')

interface AnswerInput {
  wordId: string
  rating: ReviewRating
  mode: string
  config: SrsConfig
  durationMs?: number
  now?: number
}

/**
 * Saves one answer atomically: new SRS state, review log, XP — and words you forget land
 * in "My Mistakes" so you can drill them later. Returns the updated word.
 */
export async function recordAnswer({
  wordId,
  rating,
  mode,
  config,
  durationMs,
  now = Date.now(),
}: AnswerInput): Promise<Word> {
  return db.transaction('rw', [db.words, db.reviewLogs, db.activity, db.collections], async () => {
    const word = await db.words.get(wordId)
    if (!word) throw new Error(`Word not found: ${wordId}`)

    let collectionIds = word.collectionIds
    if (
      rating === 'again' &&
      !collectionIds.includes(MISTAKES_COLLECTION_ID) &&
      (await db.collections.get(MISTAKES_COLLECTION_ID))
    ) {
      collectionIds = [...collectionIds, MISTAKES_COLLECTION_ID]
    }

    const updated: Word = {
      ...word,
      collectionIds,
      srs: schedule(word.srs, rating, now, config),
      updatedAt: now,
    }
    await db.words.put(updated)
    await db.reviewLogs.add({
      wordId,
      at: now,
      rating,
      mode,
      durationMs,
      wasNew: word.srs.status === 'new',
    })
    await logActivity({
      type: 'review',
      xp: XP_PER_REVIEW,
      subject: word.term,
      refId: word.id,
      at: now,
    })
    return updated
  })
}

export function getTodayLogs(now = Date.now()): Promise<ReviewLog[]> {
  return db.reviewLogs
    .where('at')
    .aboveOrEqual(startOfDay(new Date(now)).getTime())
    .toArray()
}

export const countIntroduced = (logs: ReviewLog[]) => logs.filter((l) => l.wasNew).length

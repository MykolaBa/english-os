import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { ReadingProgress } from '@/lib/db/types'
import { scorePercent, type AttemptResult } from '@/lib/exercises/check'

/** XP: one per correct answer, plus a bonus the first time a text is read to the end. */
export const XP_FIRST_READ = 10

/** Answering the comprehension questions counts as reading the text. */
export async function recordReading(
  textId: string,
  title: string,
  result: AttemptResult,
  now = Date.now(),
): Promise<ReadingProgress> {
  const score = scorePercent(result)
  const { before, after } = await db.transaction('rw', db.readingProgress, async () => {
    const current = await db.readingProgress.get(textId)
    const next: ReadingProgress = {
      textId,
      readAt: current?.readAt ?? now,
      attempts: (current?.attempts ?? 0) + 1,
      bestScore: Math.max(current?.bestScore ?? 0, score),
      lastScore: score,
      updatedAt: now,
    }
    await db.readingProgress.put(next)
    return { before: current, after: next }
  })
  await logActivity({
    type: 'reading',
    xp: result.correct + (before?.readAt === undefined ? XP_FIRST_READ : 0),
    subject: title,
    refId: textId,
    at: now,
  })
  return after
}

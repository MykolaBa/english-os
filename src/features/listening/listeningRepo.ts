import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { ListeningProgress } from '@/lib/db/types'
import { scorePercent, type AttemptResult } from '@/lib/exercises/check'

/** XP: one per correct answer, plus a bonus the first time an episode is completed. */
export const XP_FIRST_LISTEN = 10

/** Answering the dictation and questions completes the episode. Progress and XP together. */
export async function recordListening(
  episodeId: string,
  title: string,
  result: AttemptResult,
  now = Date.now(),
): Promise<ListeningProgress> {
  const score = scorePercent(result)
  return db.transaction('rw', db.listeningProgress, db.activity, async () => {
    const current = await db.listeningProgress.get(episodeId)
    const next: ListeningProgress = {
      episodeId,
      completedAt: current?.completedAt ?? now,
      attempts: (current?.attempts ?? 0) + 1,
      bestScore: Math.max(current?.bestScore ?? 0, score),
      lastScore: score,
      updatedAt: now,
    }
    await db.listeningProgress.put(next)
    await logActivity({
      type: 'listening',
      xp: result.correct + (current?.completedAt === undefined ? XP_FIRST_LISTEN : 0),
      subject: title,
      refId: episodeId,
      at: now,
    })
    return next
  })
}

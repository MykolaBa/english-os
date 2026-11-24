import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { LessonProgress } from '@/lib/db/types'
import { scorePercent, type AttemptResult } from '@/lib/exercises/check'

/** A lesson counts as completed from this score up (or when marked by hand). */
export const PASS_SCORE = 70
/** XP: one per correct answer, plus a bonus the first time a lesson is completed. */
export const XP_FIRST_COMPLETION = 10

function blank(lessonId: string, now: number): LessonProgress {
  return {
    lessonId,
    status: 'in_progress',
    bookmarked: false,
    attempts: 0,
    lastMistakes: [],
    updatedAt: now,
  }
}

async function upsert(
  lessonId: string,
  change: (p: LessonProgress) => LessonProgress,
  now: number,
) {
  return db.transaction('rw', db.lessonProgress, async () => {
    const current = (await db.lessonProgress.get(lessonId)) ?? blank(lessonId, now)
    const next = { ...change(current), updatedAt: now }
    await db.lessonProgress.put(next)
    return { before: current, after: next }
  })
}

/** Opening a lesson marks it as started (once). */
export async function markOpened(lessonId: string, now = Date.now()): Promise<void> {
  if (await db.lessonProgress.get(lessonId)) return
  await db.lessonProgress.add(blank(lessonId, now)).catch((err: unknown) => {
    // Another call added it in the meantime — fine. Anything else is a real failure.
    if (!(err instanceof Error && err.name === 'ConstraintError')) throw err
  })
}

export async function recordAttempt(
  lessonId: string,
  title: string,
  result: AttemptResult,
  now = Date.now(),
): Promise<LessonProgress> {
  const score = scorePercent(result)
  // Progress and XP are one change: if either write fails, neither is kept.
  return db.transaction('rw', db.lessonProgress, db.activity, async () => {
    const { before, after } = await upsert(
      lessonId,
      (p) => {
        const passed = score >= PASS_SCORE
        return {
          ...p,
          attempts: p.attempts + 1,
          lastScore: score,
          bestScore: Math.max(p.bestScore ?? 0, score),
          lastMistakes: result.mistakes,
          status: passed || p.status === 'completed' ? 'completed' : 'in_progress',
          completedAt: p.completedAt ?? (passed ? now : undefined),
        }
      },
      now,
    )
    const firstCompletion = before.status !== 'completed' && after.status === 'completed'
    await logActivity({
      type: 'grammar_lesson',
      xp: result.correct + (firstCompletion ? XP_FIRST_COMPLETION : 0),
      subject: title,
      refId: lessonId,
      at: now,
    })
    return after
  })
}

export async function setCompleted(lessonId: string, completed: boolean, now = Date.now()) {
  await upsert(
    lessonId,
    (p) => ({
      ...p,
      status: completed ? 'completed' : 'in_progress',
      completedAt: completed ? (p.completedAt ?? now) : undefined,
    }),
    now,
  )
}

export async function toggleBookmark(lessonId: string, now = Date.now()) {
  await upsert(lessonId, (p) => ({ ...p, bookmarked: !p.bookmarked }), now)
}

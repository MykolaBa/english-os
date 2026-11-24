import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { InterviewAnswer, InterviewStatus } from '@/lib/db/types'
import type { AttemptResult } from '@/lib/exercises/check'
import { XP_PER_MOCK_QUESTION } from './mock'

/** XP for writing your own answer the first time, and again for getting confident with it. */
export const XP_ANSWER_WRITTEN = 5
export const XP_ANSWER_CONFIDENT = 5

/** One XP per phrase recognised. */
export async function recordPhrasePractice(
  setId: string,
  title: string,
  result: AttemptResult,
  now = Date.now(),
): Promise<void> {
  await logActivity({
    type: 'it_english',
    xp: result.correct,
    subject: title,
    refId: setId,
    at: now,
  })
}

/**
 * Saves the learner's answer. XP only for progress — the first answer and the first time
 * it's marked confident — so editing a sentence doesn't farm points.
 */
export async function saveInterviewAnswer(
  questionId: string,
  question: string,
  change: { answer?: string; status?: InterviewStatus },
  now = Date.now(),
): Promise<InterviewAnswer> {
  const { before, after } = await db.transaction('rw', db.interviewAnswers, async () => {
    const current = await db.interviewAnswers.get(questionId)
    const answer = change.answer ?? current?.answer ?? ''
    const status = change.status ?? current?.status ?? 'practising'
    const next: InterviewAnswer = {
      questionId,
      answer,
      status,
      answeredAt: current?.answeredAt ?? (answer.trim() ? now : undefined),
      confidentAt: current?.confidentAt ?? (status === 'confident' ? now : undefined),
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    }
    await db.interviewAnswers.put(next)
    return { before: current, after: next }
  })

  const firstAnswer = before?.answeredAt === undefined && after.answeredAt !== undefined
  const becameConfident = before?.confidentAt === undefined && after.confidentAt !== undefined
  const xp = (firstAnswer ? XP_ANSWER_WRITTEN : 0) + (becameConfident ? XP_ANSWER_CONFIDENT : 0)
  if (xp > 0) {
    await logActivity({ type: 'it_english', xp, subject: question, refId: questionId, at: now })
  }
  return after
}

/** A finished mock interview: XP for every question answered. */
export async function recordMockInterview(answered: number, now = Date.now()): Promise<void> {
  if (answered === 0) return
  await logActivity({
    type: 'it_english',
    xp: answered * XP_PER_MOCK_QUESTION,
    // Like lesson and text titles, the subject is the activity's English name.
    subject: 'Mock interview',
    refId: 'mock-interview',
    at: now,
  })
}

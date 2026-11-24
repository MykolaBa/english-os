import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { InterviewAnswer } from '@/lib/db/types'

/** Every saved answer by question id. `undefined` while loading. */
export function useInterviewAnswers(): Map<string, InterviewAnswer> | undefined {
  return useLiveQuery(async () => {
    const rows = await db.interviewAnswers.toArray()
    return new Map(rows.map((r) => [r.questionId, r]))
  }, [])
}

/** `null` when the question hasn't been answered yet. */
export function useInterviewAnswer(
  questionId: string | undefined,
): InterviewAnswer | null | undefined {
  return useLiveQuery(
    async () => (questionId ? ((await db.interviewAnswers.get(questionId)) ?? null) : null),
    [questionId],
  )
}

import type { InterviewQuestion } from '@/content/it'
import { createRng, shuffleWith } from '@/lib/exercises/random'

export const MOCK_KINDS = ['all', 'behavioural', 'technical'] as const
export type MockKind = (typeof MOCK_KINDS)[number]
export const MOCK_SIZES = [3, 5] as const
export type MockSize = (typeof MOCK_SIZES)[number]
/** Seconds per answer: long enough for a structured answer, short enough to stay focused. */
export const ANSWER_SECONDS = 120
/** XP per question answered in a mock interview. */
export const XP_PER_MOCK_QUESTION = 3

/**
 * Questions for one mock interview. A real interview usually opens with "tell me about
 * yourself", so when it's in the pool it always comes first; the rest is shuffled.
 */
export function pickMockQuestions(
  questions: readonly InterviewQuestion[],
  kind: MockKind,
  size: number,
  seed: string,
): InterviewQuestion[] {
  const pool = questions.filter((q) => kind === 'all' || q.kind === kind)
  const opener = pool.find((q) => q.id === 'tell-me-about-yourself')
  const rest = shuffleWith(
    pool.filter((q) => q !== opener),
    createRng(seed),
  )
  return (opener ? [opener, ...rest] : rest).slice(0, size)
}

/** 95 → "1:35" */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

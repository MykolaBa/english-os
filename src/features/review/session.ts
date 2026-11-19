import type { ReviewRating, Word } from '@/lib/db/types'

/** `scheduled` follows the SRS plan; `practice` repeats learned words without rescheduling. */
export type SessionKind = 'scheduled' | 'practice'

/**
 * Review session state as a reducer — pure, so the whole flow is testable without UI.
 * Words answered "again" go to the back of the queue and come back in the same session.
 */

export interface SessionAnswer {
  wordId: string
  rating: ReviewRating
}

export interface SessionState {
  /** Remaining word ids; the first one is on screen. */
  queue: string[]
  /** Latest version of each word (updated after every answer). */
  words: Record<string, Word>
  answers: SessionAnswer[]
  /** Unique words seen in this session. */
  total: number
  startedAt: number
  revealed: boolean
}

export type SessionAction =
  { type: 'reveal' } | { type: 'answered'; rating: ReviewRating; word: Word }

export function startSession(words: Word[], now: number): SessionState {
  return {
    queue: words.map((w) => w.id),
    words: Object.fromEntries(words.map((w) => [w.id, w])),
    answers: [],
    total: words.length,
    startedAt: now,
    revealed: false,
  }
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'reveal':
      return { ...state, revealed: true }
    case 'answered': {
      const [current, ...rest] = state.queue
      if (current !== action.word.id) return state // stale answer (double tap)
      return {
        ...state,
        queue: action.rating === 'again' ? [...rest, current] : rest,
        words: { ...state.words, [current]: action.word },
        answers: [...state.answers, { wordId: current, rating: action.rating }],
        revealed: false,
      }
    }
  }
}

export interface SessionSummary {
  reviewed: number
  correct: number
  accuracy: number
  /** Words answered "again" at least once — worth extra practice. */
  struggled: string[]
}

export function summarize(state: SessionState): SessionSummary {
  const correct = state.answers.filter((a) => a.rating !== 'again').length
  const struggled = [
    ...new Set(state.answers.filter((a) => a.rating === 'again').map((a) => a.wordId)),
  ]
  return {
    reviewed: state.answers.length,
    correct,
    accuracy: state.answers.length ? correct / state.answers.length : 0,
    struggled,
  }
}

export const currentWord = (s: SessionState): Word | undefined =>
  s.queue[0] ? s.words[s.queue[0]] : undefined

/** Progress counts unique words that left the queue for good. */
export const completedCount = (s: SessionState) => s.total - new Set(s.queue).size

export type PlanStepId = 'add-words' | 'set-goal' | 'review' | 'new-words' | 'goal' | 'backup'

/** Text is resolved in the UI via i18n, so this stays pure data (and easy to test). */
export interface PlanStep {
  id: PlanStepId
  to: string
  done: boolean
}

export interface PlanInput {
  totalWords: number
  dueCount: number
  todayXp: number
  dailyXpGoal: number
  /** Set when a backup is overdue; `days` is null when there has never been one. */
  backupDue?: { days: number | null } | null
}

/**
 * A small, realistic daily plan derived from the current state.
 * Intentionally short (≤ 3 steps): consistency beats volume.
 */
export function buildTodayPlan({
  totalWords,
  dueCount,
  todayXp,
  dailyXpGoal,
  backupDue,
}: PlanInput): PlanStep[] {
  if (totalWords === 0) {
    return [
      { id: 'add-words', to: '/vocabulary', done: false },
      { id: 'set-goal', to: '/settings', done: false },
    ]
  }
  return [
    { id: 'review', to: '/review', done: dueCount === 0 },
    { id: 'new-words', to: '/vocabulary', done: false },
    { id: 'goal', to: '/review', done: todayXp >= dailyXpGoal },
    ...(backupDue ? [{ id: 'backup' as const, to: '/settings', done: false }] : []),
  ]
}

/** Rough review time: ~9 seconds per card. */
export function estimateReviewMinutes(cards: number): number {
  return Math.max(1, Math.round(cards * 0.15))
}

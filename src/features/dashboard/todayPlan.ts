export type PlanStepId = 'add-words' | 'set-goal'

/** Text is resolved in the UI via i18n, so this stays pure data (and easy to test). */
export interface PlanStep {
  id: PlanStepId
  to: string
  done: boolean
}

/**
 * First steps for an empty vocabulary. Once there are words, the dashboard shows the
 * planner's agenda instead (features/planner) — one plan, not two.
 */
export function onboardingSteps(): PlanStep[] {
  return [
    { id: 'add-words', to: '/vocabulary', done: false },
    { id: 'set-goal', to: '/settings', done: false },
  ]
}

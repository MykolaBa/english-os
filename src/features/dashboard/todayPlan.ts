export interface PlanStep {
  id: string
  title: string
  detail: string
  to: string
  done: boolean
}

export interface PlanInput {
  totalWords: number
  dueCount: number
  todayXp: number
  dailyXpGoal: number
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
}: PlanInput): PlanStep[] {
  if (totalWords === 0) {
    return [
      {
        id: 'add-words',
        title: 'Add your first words',
        detail: 'Start with 5–10 words you met recently — that’s the core of EnglishOS.',
        to: '/vocabulary',
        done: false,
      },
      {
        id: 'set-goal',
        title: 'Set your daily goal',
        detail: 'Pick a goal you can keep even on a busy day.',
        to: '/settings',
        done: false,
      },
    ]
  }

  return [
    {
      id: 'review',
      title:
        dueCount > 0
          ? `Review ${dueCount} due ${dueCount === 1 ? 'word' : 'words'}`
          : 'Reviews are done',
      detail:
        dueCount > 0
          ? `About ${Math.max(1, Math.round(dueCount * 0.15))} min with flashcards.`
          : 'Nothing is due right now. Nice work.',
      to: '/review',
      done: dueCount === 0,
    },
    {
      id: 'new-words',
      title: 'Learn 5 new words',
      detail: 'Add words from today’s reading, work or videos.',
      to: '/vocabulary',
      done: false,
    },
    {
      id: 'goal',
      title: `Reach ${dailyXpGoal} XP`,
      detail: `${Math.min(todayXp, dailyXpGoal)} / ${dailyXpGoal} XP so far today.`,
      to: '/review',
      done: todayXp >= dailyXpGoal,
    },
  ]
}

import { describe, expect, it } from 'vitest'
import { buildTodayPlan, estimateReviewMinutes } from './todayPlan'

describe('buildTodayPlan', () => {
  it('suggests onboarding steps when the vocabulary is empty', () => {
    const plan = buildTodayPlan({ totalWords: 0, dueCount: 0, todayXp: 0, dailyXpGoal: 50 })
    expect(plan.map((s) => s.id)).toEqual(['add-words', 'set-goal'])
  })

  it('puts due reviews first and marks the goal as done when reached', () => {
    const plan = buildTodayPlan({ totalWords: 40, dueCount: 12, todayXp: 60, dailyXpGoal: 50 })
    expect(plan[0]).toMatchObject({ id: 'review', done: false })
    expect(plan.find((s) => s.id === 'goal')?.done).toBe(true)
  })

  it('marks reviews done when nothing is due', () => {
    const plan = buildTodayPlan({ totalWords: 10, dueCount: 0, todayXp: 0, dailyXpGoal: 50 })
    expect(plan[0]?.done).toBe(true)
  })
})

describe('backup reminder', () => {
  it('adds a backup step only when one is due', () => {
    const base = { totalWords: 10, dueCount: 0, todayXp: 0, dailyXpGoal: 50 }
    expect(buildTodayPlan(base).some((s) => s.id === 'backup')).toBe(false)
    expect(buildTodayPlan({ ...base, backupDue: { days: null } }).at(-1)?.id).toBe('backup')
  })
})

describe('estimateReviewMinutes', () => {
  it('never returns less than a minute', () => {
    expect(estimateReviewMinutes(1)).toBe(1)
    expect(estimateReviewMinutes(40)).toBe(6)
  })
})

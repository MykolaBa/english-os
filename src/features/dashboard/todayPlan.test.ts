import { describe, expect, it } from 'vitest'
import { buildTodayPlan } from './todayPlan'

describe('buildTodayPlan', () => {
  it('suggests onboarding steps when the vocabulary is empty', () => {
    const plan = buildTodayPlan({ totalWords: 0, dueCount: 0, todayXp: 0, dailyXpGoal: 50 })
    expect(plan[0]?.id).toBe('add-words')
  })

  it('puts due reviews first and marks the goal as done when reached', () => {
    const plan = buildTodayPlan({ totalWords: 40, dueCount: 12, todayXp: 60, dailyXpGoal: 50 })
    expect(plan[0]).toMatchObject({ id: 'review', title: 'Review 12 due words', done: false })
    expect(plan.find((s) => s.id === 'goal')?.done).toBe(true)
  })

  it('marks reviews done when nothing is due', () => {
    const plan = buildTodayPlan({ totalWords: 10, dueCount: 0, todayXp: 0, dailyXpGoal: 50 })
    expect(plan[0]?.done).toBe(true)
  })
})

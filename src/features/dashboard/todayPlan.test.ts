import { describe, expect, it } from 'vitest'
import { onboardingSteps } from './todayPlan'

describe('onboardingSteps', () => {
  it('starts an empty vocabulary with words, then a goal', () => {
    expect(onboardingSteps().map((s) => s.id)).toEqual(['add-words', 'set-goal'])
  })
})

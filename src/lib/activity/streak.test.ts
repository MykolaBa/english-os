import { describe, expect, it } from 'vitest'
import { computeCurrentStreak, computeLongestStreak } from './streak'

const today = new Date(2026, 10, 19) // 19 Nov 2026, local time

describe('computeCurrentStreak', () => {
  it('is 0 with no activity', () => {
    expect(computeCurrentStreak([], today)).toBe(0)
  })

  it('counts consecutive days ending today', () => {
    expect(computeCurrentStreak(['2026-11-17', '2026-11-18', '2026-11-19'], today)).toBe(3)
  })

  it('stays alive from yesterday when today has no activity yet', () => {
    expect(computeCurrentStreak(['2026-11-17', '2026-11-18'], today)).toBe(2)
  })

  it('breaks after a missed day', () => {
    expect(computeCurrentStreak(['2026-11-15', '2026-11-16', '2026-11-19'], today)).toBe(1)
    expect(computeCurrentStreak(['2026-11-16', '2026-11-17'], today)).toBe(0)
  })

  it('works across month boundaries', () => {
    const dec2 = new Date(2026, 11, 2)
    expect(computeCurrentStreak(['2026-11-30', '2026-12-01', '2026-12-02'], dec2)).toBe(3)
  })
})

describe('computeLongestStreak', () => {
  it('finds the longest run regardless of order and duplicates', () => {
    const days = [
      '2026-11-10',
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
      '2026-11-02',
      '2026-11-11',
    ]
    expect(computeLongestStreak(days)).toBe(3)
  })

  it('is 0 for empty history', () => {
    expect(computeLongestStreak([])).toBe(0)
  })
})

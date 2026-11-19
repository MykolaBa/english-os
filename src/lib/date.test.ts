import { describe, expect, it } from 'vitest'
import { formatDue } from './date'

const thuEvening = new Date(2026, 10, 19, 19, 0).getTime()

describe('formatDue', () => {
  it('counts calendar days, not 24-hour blocks', () => {
    expect(formatDue(new Date(2026, 10, 22).getTime(), 'en-US', 'now', thuEvening)).toBe(
      'in 3 days',
    )
    expect(formatDue(new Date(2026, 10, 20).getTime(), 'en-US', 'now', thuEvening)).toBe('tomorrow')
    expect(formatDue(new Date(2026, 10, 20).getTime(), 'uk-UA', 'щойно', thuEvening)).toBe('завтра')
  })

  it('uses minutes for the next few hours', () => {
    expect(formatDue(thuEvening + 10 * 60_000, 'en-US', 'now', thuEvening)).toBe('in 10 min.')
  })
})

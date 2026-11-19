import { describe, expect, it } from 'vitest'
import { createInitialSrs } from '@/features/vocabulary/model'
import { toDayKey } from '@/lib/date'
import { previewIntervals, schedule } from './scheduler'

const NOW = new Date(2026, 10, 19, 20, 30).getTime() // 19 Nov 2026, 20:30 local
const fresh = createInitialSrs(NOW)

describe('schedule', () => {
  it('uses the configured base intervals for a new word', () => {
    expect(schedule(fresh, 'hard', NOW).intervalDays).toBe(1)
    expect(schedule(fresh, 'good', NOW).intervalDays).toBe(3)
    expect(schedule(fresh, 'easy', NOW).intervalDays).toBe(7)
    expect(
      schedule(fresh, 'good', NOW, { againMinutes: 5, hardDays: 2, goodDays: 4, easyDays: 9 })
        .intervalDays,
    ).toBe(4)
  })

  it('brings a forgotten word back in 10 minutes', () => {
    const next = schedule(fresh, 'again', NOW)
    expect(next.status).toBe('learning')
    expect(next.dueAt - NOW).toBe(10 * 60_000)
    expect(next.incorrectCount).toBe(1)
    expect(next.lapses).toBe(0) // never learned yet — not a lapse
  })

  it('schedules for the start of the due day', () => {
    const next = schedule(fresh, 'good', NOW)
    expect(toDayKey(next.dueAt)).toBe('2026-11-22')
    expect(new Date(next.dueAt).getHours()).toBe(0)
  })

  it('grows intervals with successful reviews', () => {
    let srs = schedule(fresh, 'good', NOW) // 3 d
    srs = schedule(srs, 'good', NOW) // 3 × 2.5 ≈ 8
    expect(srs.intervalDays).toBe(8)
    srs = schedule(srs, 'good', NOW) // 8 × 2.5 = 20
    expect(srs.intervalDays).toBe(20)
    expect(srs.status).toBe('reviewing')
    srs = schedule(srs, 'good', NOW)
    expect(srs.intervalDays).toBe(50)
    expect(srs.status).toBe('mastered')
  })

  it('resets the interval, lowers ease and counts a lapse when a learned word is forgotten', () => {
    const learned = schedule(schedule(fresh, 'good', NOW), 'good', NOW)
    const forgotten = schedule(learned, 'again', NOW)
    expect(forgotten.intervalDays).toBe(0)
    expect(forgotten.lapses).toBe(1)
    expect(forgotten.ease).toBeLessThan(learned.ease)
  })

  it('never drops ease below 1.3 and always moves at least a day forward', () => {
    let srs = { ...fresh, intervalDays: 1, ease: 1.3 }
    srs = schedule(srs, 'hard', NOW)
    expect(srs.ease).toBe(1.3)
    expect(srs.intervalDays).toBe(2)
  })

  it('previews what each button does', () => {
    expect(previewIntervals(fresh)).toEqual({
      again: { minutes: 10 },
      hard: { days: 1 },
      good: { days: 3 },
      easy: { days: 7 },
    })
  })
})

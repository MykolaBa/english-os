import { describe, expect, it } from 'vitest'
import type { ActivityEvent } from '@/lib/db/types'
import { PLAN_AREAS } from '@/lib/plan'
import { buildAgenda, reviewMinutes, rotateFocus, type AgendaInput } from './agenda'
import { weekProgress } from './week'

// 2026-11-26 is a Thursday.
const THU = '2026-11-26'
const next = Object.fromEntries(
  PLAN_AREAS.map((a) => [a, { to: `/${a}/next`, title: `Next ${a}` }]),
)
const base: AgendaInput = {
  today: THU,
  days: [1, 2, 3, 4, 5],
  minutes: 30,
  focus: [...PLAN_AREAS],
  dueCount: 20,
  newLeft: 5,
  next,
  todayActivity: [],
}
const event = (type: ActivityEvent['type'], subject: string, day = THU): ActivityEvent => ({
  type,
  subject,
  xp: 5,
  at: 0,
  day,
})

describe('buildAgenda', () => {
  it('starts with review, then fills the budget with rotating skills', () => {
    const agenda = buildAgenda(base)
    expect(agenda.items[0]).toMatchObject({
      kind: 'review',
      minutes: reviewMinutes(25),
      done: false,
    })
    const total = agenda.items.reduce((s, i) => s + i.minutes, 0)
    expect(total).toBeLessThanOrEqual(base.minutes + 3)
    expect(agenda.items.length).toBeGreaterThan(1)
  })

  it('starts the skills with a different area on consecutive days', () => {
    expect(rotateFocus(PLAN_AREAS, '2026-11-26')[0]).not.toBe(
      rotateFocus(PLAN_AREAS, '2026-11-27')[0],
    )
  })

  it('is empty on a day off unless studying anyway', () => {
    expect(buildAgenda({ ...base, today: '2026-11-28' }).items).toEqual([]) // Saturday
    expect(
      buildAgenda({ ...base, today: '2026-11-28', forceStudyDay: true }).items.length,
    ).toBeGreaterThan(0)
  })

  it('marks items done from today’s activity, showing what was done', () => {
    const area = rotateFocus(PLAN_AREAS, THU)[0]!
    const type = {
      grammar: 'grammar_lesson',
      reading: 'reading',
      listening: 'listening',
      speaking: 'speaking',
      writing: 'writing',
      it: 'it_english',
    } as const
    const agenda = buildAgenda({
      ...base,
      dueCount: 0,
      todayActivity: [event('review', 'word'), event(type[area], 'What I did')],
    })
    expect(agenda.items[0]).toMatchObject({ kind: 'review', done: true })
    expect(agenda.items.find((i) => i.kind === area)).toMatchObject({
      done: true,
      title: 'What I did',
    })
  })

  it('skips areas with nothing to offer and keeps at least one skill on a tiny budget', () => {
    const only = buildAgenda({
      ...base,
      minutes: 15,
      dueCount: 200,
      next: { reading: next.reading },
    })
    expect(only.items.map((i) => i.kind)).toEqual(['review', 'reading'])
  })

  it('has no review item when nothing is due and nothing new is allowed', () => {
    expect(buildAgenda({ ...base, dueCount: 0, newLeft: 0 }).items[0]?.kind).not.toBe('review')
  })
})

describe('weekProgress', () => {
  it('compares planned days with days studied so far', () => {
    const now = new Date(2026, 10, 26, 12).getTime() // Thursday
    const { week, plannedSoFar, metSoFar } = weekProgress(
      now,
      [1, 2, 3, 4, 5],
      [
        event('review', 'x', '2026-11-23'), // Monday
        event('review', 'x', '2026-11-26'), // Thursday
      ],
    )
    expect(week.map((d) => d.day)).toEqual([
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
      '2026-11-27',
      '2026-11-28',
      '2026-11-29',
    ])
    expect(plannedSoFar).toBe(4) // Mon–Thu
    expect(metSoFar).toBe(2)
    expect(week[3]).toMatchObject({ isToday: true, studied: true, xp: 5 })
    expect(week[4]?.isFuture).toBe(true)
  })
})

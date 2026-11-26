import { fromDayKey, type DayKey } from '@/lib/date'
import type { ActivityEvent, ActivityType } from '@/lib/db/types'
import type { PlanArea } from '@/lib/plan'

/**
 * Today's agenda, derived — nothing is stored: the plan (settings), what's waiting in the
 * app (due words, the next lesson…) and today's activity (what's already done).
 */

export type AgendaKind = 'review' | PlanArea

/** What to open next for one area: a link and, for content, its English title. */
export interface NextStep {
  to: string
  title: string | null
}

export interface AgendaItem {
  kind: AgendaKind
  to: string
  /** English content title (lesson, text…), or null for review. */
  title: string | null
  minutes: number
  done: boolean
}

/** Typical length of one sitting per area. */
export const AREA_MINUTES: Record<PlanArea, number> = {
  grammar: 10,
  reading: 10,
  listening: 8,
  speaking: 7,
  writing: 15,
  it: 8,
}

/** The activity that marks an agenda item as done today. */
export const AREA_ACTIVITY: Record<AgendaKind, ActivityType> = {
  review: 'review',
  grammar: 'grammar_lesson',
  reading: 'reading',
  listening: 'listening',
  speaking: 'speaking',
  writing: 'writing',
  it: 'it_english',
}

export interface AgendaInput {
  today: DayKey
  days: readonly number[]
  minutes: number
  focus: readonly PlanArea[]
  /** Review words due now, and new words still allowed today. */
  dueCount: number
  newLeft: number
  /** Where to go next in each area (null when the area has nothing to offer). */
  next: Partial<Record<PlanArea, NextStep | null>>
  todayActivity: readonly ActivityEvent[]
  /** Show the agenda on a day off too ("study anyway"). */
  forceStudyDay?: boolean
}

export interface Agenda {
  studyDay: boolean
  budget: number
  items: AgendaItem[]
}

const DAY_MS = 86_400_000

/** ~9 seconds a card, at least 3 minutes, at most 20 (a long backlog is spread over days). */
export const reviewMinutes = (cards: number) => Math.min(20, Math.max(3, Math.round(cards * 0.15)))

/** Rotates the focus areas so each day starts with a different one. */
export function rotateFocus(focus: readonly PlanArea[], today: DayKey): PlanArea[] {
  if (focus.length === 0) return []
  const dayNumber = Math.floor(fromDayKey(today).getTime() / DAY_MS)
  const start = ((dayNumber % focus.length) + focus.length) % focus.length
  return [...focus.slice(start), ...focus.slice(0, start)]
}

export function buildAgenda(input: AgendaInput): Agenda {
  const weekday = fromDayKey(input.today).getDay()
  const studyDay = input.forceStudyDay === true || input.days.includes(weekday)
  if (!studyDay) return { studyDay, budget: input.minutes, items: [] }

  // Done today = this kind of activity happened today; the title is what was actually done.
  const doneToday = (kind: AgendaKind) =>
    input.todayActivity.filter((e) => e.type === AREA_ACTIVITY[kind]).at(-1)

  const items: AgendaItem[] = []
  const reviewed = doneToday('review')
  if (input.dueCount > 0 || input.newLeft > 0 || reviewed) {
    items.push({
      kind: 'review',
      to: '/review',
      title: null,
      minutes: reviewMinutes(input.dueCount + Math.min(input.newLeft, 5)),
      done: reviewed !== undefined && input.dueCount === 0,
    })
  }

  let used = items.reduce((sum, i) => sum + i.minutes, 0)
  for (const area of rotateFocus(input.focus, input.today)) {
    const next = input.next[area]
    const done = doneToday(area)
    if (!next && !done) continue
    const minutes = AREA_MINUTES[area]
    // Always at least one skill besides review; then fill the budget (a little over is fine).
    const hasSkill = items.some((i) => i.kind !== 'review')
    if (hasSkill && used + minutes > input.minutes + 3) continue
    items.push({
      kind: area,
      to: next?.to ?? '/',
      title: done ? done.subject : (next?.title ?? null),
      minutes,
      done: done !== undefined,
    })
    used += minutes
  }
  return { studyDay, budget: input.minutes, items }
}

import { addDays, startOfDay, toDayKey, type DayKey } from '@/lib/date'
import type { ActivityEvent } from '@/lib/db/types'

export interface WeekDay {
  day: DayKey
  weekday: number
  planned: boolean
  studied: boolean
  xp: number
  isToday: boolean
  isFuture: boolean
}

/** Monday of the week that contains `now`. */
export function weekStart(now: number): Date {
  const d = startOfDay(new Date(now))
  const fromMonday = (d.getDay() + 6) % 7
  return addDays(d, -fromMonday)
}

/** This week, Monday to Sunday: planned days against the days you actually studied. */
export function weekProgress(
  now: number,
  days: readonly number[],
  activity: readonly ActivityEvent[],
): { week: WeekDay[]; plannedSoFar: number; metSoFar: number } {
  const today = toDayKey(now)
  const xpByDay = new Map<DayKey, number>()
  for (const e of activity) xpByDay.set(e.day, (xpByDay.get(e.day) ?? 0) + e.xp)
  const monday = weekStart(now)
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const day = toDayKey(date)
    return {
      day,
      weekday: date.getDay(),
      planned: days.includes(date.getDay()),
      studied: xpByDay.has(day),
      xp: xpByDay.get(day) ?? 0,
      isToday: day === today,
      isFuture: day > today,
    }
  })
  const past = week.filter((d) => d.planned && !d.isFuture)
  return { week, plannedSoFar: past.length, metSoFar: past.filter((d) => d.studied).length }
}

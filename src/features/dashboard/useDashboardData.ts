import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { ActivityEvent } from '@/lib/db/types'
import {
  getActiveDays,
  getActivitySince,
  getRecentActivity,
  sumXp,
} from '@/lib/activity/activityRepo'
import { computeCurrentStreak, computeLongestStreak } from '@/lib/activity/streak'
import { addDays, lastDays, startOfDay, toDayKey, type DayKey } from '@/lib/date'

export interface DayActivity {
  day: DayKey
  xp: number
}

export interface DashboardData {
  totalWords: number
  masteredWords: number
  dueCount: number
  todayXp: number
  currentStreak: number
  longestStreak: number
  totalStudyDays: number
  week: DayActivity[]
  recent: ActivityEvent[]
}

async function loadDashboard(): Promise<DashboardData> {
  const now = Date.now()
  const weekStart = startOfDay(addDays(new Date(), -6)).getTime()

  const [totalWords, masteredWords, dueCount, weekEvents, activeDays, recent] = await Promise.all([
    db.words.count(),
    db.words.where('srs.status').equals('mastered').count(),
    db.words.where('srs.dueAt').belowOrEqual(now).count(),
    getActivitySince(weekStart),
    getActiveDays(),
    getRecentActivity(6),
  ])

  const xpByDay = new Map<DayKey, number>()
  for (const e of weekEvents) xpByDay.set(e.day, (xpByDay.get(e.day) ?? 0) + e.xp)
  const today = toDayKey()

  return {
    totalWords,
    masteredWords,
    dueCount,
    todayXp: sumXp(weekEvents.filter((e) => e.day === today)),
    currentStreak: computeCurrentStreak(activeDays),
    longestStreak: computeLongestStreak(activeDays),
    totalStudyDays: activeDays.length,
    week: lastDays(7).map((day) => ({ day, xp: xpByDay.get(day) ?? 0 })),
    recent,
  }
}

/** Live dashboard data: re-renders automatically when any underlying table changes. `undefined` while loading. */
export function useDashboardData(): DashboardData | undefined {
  return useLiveQuery(loadDashboard, [])
}

export function useDueCount(): number {
  return useLiveQuery(() => db.words.where('srs.dueAt').belowOrEqual(Date.now()).count(), []) ?? 0
}

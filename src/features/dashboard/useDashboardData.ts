import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import { groupFeed, type FeedItem } from '@/lib/activity/feed'
import type { Word } from '@/lib/db/types'
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
  newWords: number
  /** The word the dashboard opens with: the most overdue review, else the newest unlearned word. */
  spotlight: Word | null
  masteredWords: number
  dueCount: number
  todayXp: number
  currentStreak: number
  longestStreak: number
  totalStudyDays: number
  week: DayActivity[]
  recent: FeedItem[]
}

/**
 * Words already in the review cycle whose time has come. Brand-new words are not "due" —
 * they're introduced gradually by the review session (phase 3).
 */
function countDue(now = Date.now()): Promise<number> {
  return db.words
    .where('srs.dueAt')
    .belowOrEqual(now)
    .filter((w) => w.srs.status !== 'new')
    .count()
}

async function findSpotlight(now = Date.now()): Promise<Word | null> {
  const due = await db.words
    .where('srs.dueAt')
    .belowOrEqual(now)
    .filter((w) => w.srs.status !== 'new')
    .first()
  if (due) return due
  const fresh = await db.words
    .orderBy('createdAt')
    .reverse()
    .filter((w) => w.srs.status === 'new')
    .first()
  return fresh ?? null
}

async function loadDashboard(): Promise<DashboardData> {
  const weekStart = startOfDay(addDays(new Date(), -6)).getTime()

  const [totalWords, newWords, masteredWords, dueCount, weekEvents, activeDays, recent, spotlight] =
    await Promise.all([
      db.words.count(),
      db.words.where('srs.status').equals('new').count(),
      db.words.where('srs.status').equals('mastered').count(),
      countDue(),
      getActivitySince(weekStart),
      getActiveDays(),
      getRecentActivity(80),
      findSpotlight(),
    ])

  const xpByDay = new Map<DayKey, number>()
  for (const e of weekEvents) xpByDay.set(e.day, (xpByDay.get(e.day) ?? 0) + e.xp)
  const today = toDayKey()

  return {
    totalWords,
    newWords,
    spotlight,
    masteredWords,
    dueCount,
    todayXp: sumXp(weekEvents.filter((e) => e.day === today)),
    currentStreak: computeCurrentStreak(activeDays),
    longestStreak: computeLongestStreak(activeDays),
    totalStudyDays: activeDays.length,
    week: lastDays(7).map((day) => ({ day, xp: xpByDay.get(day) ?? 0 })),
    recent: groupFeed(recent, 6),
  }
}

/** Live dashboard data: re-renders automatically when any underlying table changes. `undefined` while loading. */
export function useDashboardData(): DashboardData | undefined {
  return useLiveQuery(loadDashboard, [])
}

export function useDueCount(): number {
  return useLiveQuery(() => countDue(), []) ?? 0
}

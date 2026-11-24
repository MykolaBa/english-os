import { useLiveQuery } from 'dexie-react-hooks'
import { useNow } from '@/lib/useNow'
import { db } from '@/lib/db/db'
import { getLastBackupAt } from '@/features/backup/backup'
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
  /** Answers given in review sessions today. */
  reviewedToday: number
  todayXp: number
  currentStreak: number
  longestStreak: number
  totalStudyDays: number
  week: DayActivity[]
  recent: FeedItem[]
  /** Non-null when a backup is overdue (progress exists, last backup missing or 14+ days old). */
  backupDue: { days: number | null } | null
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

async function loadDashboard(now: number): Promise<DashboardData> {
  const weekStart = startOfDay(addDays(new Date(now), -6)).getTime()
  const todayStart = startOfDay(new Date(now)).getTime()

  const [totalWords, newWords, masteredWords, dueCount, weekEvents, activeDays, recent, spotlight] =
    await Promise.all([
      db.words.count(),
      db.words.where('srs.status').equals('new').count(),
      db.words.where('srs.status').equals('mastered').count(),
      countDue(now),
      getActivitySince(weekStart),
      getActiveDays(),
      getRecentActivity(80),
      findSpotlight(now),
    ])
  const [lastBackupAt, reviewCount, reviewedToday] = await Promise.all([
    getLastBackupAt(),
    db.reviewLogs.count(),
    db.reviewLogs.where('at').aboveOrEqual(todayStart).count(),
  ])
  const backupDays = lastBackupAt === null ? null : Math.floor((now - lastBackupAt) / 86_400_000)
  const backupDue =
    reviewCount > 0 && (backupDays === null || backupDays >= 14) ? { days: backupDays } : null

  const xpByDay = new Map<DayKey, number>()
  for (const e of weekEvents) xpByDay.set(e.day, (xpByDay.get(e.day) ?? 0) + e.xp)
  const today = toDayKey(now)

  return {
    totalWords,
    newWords,
    spotlight,
    masteredWords,
    dueCount,
    reviewedToday,
    todayXp: sumXp(weekEvents.filter((e) => e.day === today)),
    currentStreak: computeCurrentStreak(activeDays),
    longestStreak: computeLongestStreak(activeDays),
    totalStudyDays: activeDays.length,
    week: lastDays(7, new Date(now)).map((day) => ({ day, xp: xpByDay.get(day) ?? 0 })),
    recent: groupFeed(recent, 6),
    backupDue,
  }
}

/** Live dashboard data: re-renders automatically when any underlying table changes. `undefined` while loading. */
export function useDashboardData(): DashboardData | undefined {
  const now = useNow()
  return useLiveQuery(() => loadDashboard(now), [now])
}

export function useDueCount(): number {
  const now = useNow()
  return useLiveQuery(() => countDue(now), [now]) ?? 0
}

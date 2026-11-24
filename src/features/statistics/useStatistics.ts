import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import { useNow } from '@/lib/useNow'
import { startOfDay } from '@/lib/date'
import { WORD_STATUSES } from '@/features/vocabulary/filters'
import { PASS_SCORE } from '@/features/grammar/progressRepo'
import type { LessonProgress, Word, WordStatus } from '@/lib/db/types'
import {
  fillBuckets,
  makeBuckets,
  mostMissed,
  weakLessons,
  periodStart,
  summarize,
  xpByArea,
  type AreaXp,
  type Bucket,
  type MissedWord,
  type PeriodSummary,
  type StatPeriod,
} from './stats'

export interface StatisticsData {
  /** True when nothing was ever studied — the page shows a single empty state. */
  empty: boolean
  summary: PeriodSummary
  buckets: Bucket[]
  areas: AreaXp[]
  /** Current vocabulary by status (a snapshot, not limited to the period). */
  statuses: { status: WordStatus; count: number }[]
  missed: (MissedWord & { word: Word })[]
  /** Lessons below the pass mark (best score ever, not limited to the period). */
  weakLessons: LessonProgress[]
}

const MISSED_LIMIT = 5

async function loadStatistics(period: StatPeriod, now: number): Promise<StatisticsData> {
  const since = periodStart(period, now)
  const [events, logs, lessons, quizzes, anyActivity, statusCounts] = await Promise.all([
    db.activity.where('at').aboveOrEqual(since).toArray(),
    db.reviewLogs.where('at').aboveOrEqual(since).toArray(),
    db.lessonProgress.toArray(),
    db.quizResults.where('at').aboveOrEqual(since).toArray(),
    db.activity.count(),
    Promise.all(WORD_STATUSES.map((s) => db.words.where('srs.status').equals(s).count())),
  ])

  const missedRows = mostMissed(logs, Infinity)
  const words = await db.words.bulkGet(missedRows.map((m) => m.wordId))
  // A deleted word can still have review logs; it simply drops out of the list.
  const missed = missedRows
    .flatMap((m, i) => {
      const word = words[i]
      return word ? [{ ...m, word }] : []
    })
    .slice(0, MISSED_LIMIT)

  return {
    empty: anyActivity === 0,
    summary: summarize({ events, logs, lessons, quizzes }, since),
    buckets: fillBuckets(makeBuckets(period, now), events, logs),
    areas: xpByArea(events),
    statuses: WORD_STATUSES.map((status, i) => ({ status, count: statusCounts[i] ?? 0 })),
    missed,
    weakLessons: weakLessons(lessons, PASS_SCORE),
  }
}

/** Live statistics for the period; `undefined` while loading. */
export function useStatistics(period: StatPeriod): StatisticsData | undefined {
  // Buckets only change at midnight, so re-query once a day rather than every minute.
  const today = startOfDay(new Date(useNow())).getTime()
  return useLiveQuery(() => loadStatistics(period, today), [period, today])
}

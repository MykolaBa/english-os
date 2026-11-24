import { addDays, lastDays, startOfDay, toDayKey, type DayKey } from '@/lib/date'
import type {
  ActivityEvent,
  ActivityType,
  LessonProgress,
  QuizResult,
  ReviewLog,
} from '@/lib/db/types'

/**
 * Statistics are pure functions over raw rows (activity, review logs, quiz results).
 * Nothing is pre-counted in the database: change a formula here and every past day
 * is recalculated, and the functions are trivial to unit-test.
 */

export const STAT_PERIODS = ['week', 'month', 'quarter'] as const
export type StatPeriod = (typeof STAT_PERIODS)[number]

/**
 * How each period is cut into chart buckets. Three months of daily bars would be
 * 90 slivers on a phone, so the long period is grouped by week (13 × 7 days).
 */
const PERIOD_SHAPE = {
  week: { buckets: 7, size: 1 },
  month: { buckets: 30, size: 1 },
  quarter: { buckets: 13, size: 7 },
} as const satisfies Record<StatPeriod, { buckets: number; size: number }>

export interface Bucket {
  /** First day of the bucket (the bucket itself for daily buckets). */
  start: DayKey
  days: DayKey[]
  xp: number
  answers: number
  correct: number
  /** Percent of review answers that weren't "again"; null when there were no answers. */
  accuracy: number | null
}

export const isWeekly = (period: StatPeriod) => PERIOD_SHAPE[period].size > 1

/** Days covered by the period (91 for "3 months": 13 whole weeks). */
export const periodLength = (period: StatPeriod) =>
  PERIOD_SHAPE[period].buckets * PERIOD_SHAPE[period].size

/** Empty buckets for the period, oldest first; the last one ends today. */
export function makeBuckets(period: StatPeriod, now: number): Bucket[] {
  const { buckets, size } = PERIOD_SHAPE[period]
  const days = lastDays(periodLength(period), new Date(now))
  return Array.from({ length: buckets }, (_, i) => {
    const slice = days.slice(i * size, (i + 1) * size)
    return { start: slice[0] ?? '', days: slice, xp: 0, answers: 0, correct: 0, accuracy: null }
  })
}

/** Epoch ms of the first moment of the period (the loader reads rows from here). */
export function periodStart(period: StatPeriod, now: number): number {
  return startOfDay(addDays(new Date(now), 1 - periodLength(period))).getTime()
}

/** A review answer counts as correct unless the learner forgot the word ("again"). */
export const isCorrect = (log: ReviewLog) => log.rating !== 'again'

const toPercent = (part: number, total: number) =>
  total === 0 ? null : Math.round((part / total) * 100)

/** XP from activity and accuracy from review answers, summed per bucket. */
export function fillBuckets(
  empty: Bucket[],
  events: readonly ActivityEvent[],
  logs: readonly ReviewLog[],
): Bucket[] {
  const buckets = empty.map((b) => ({ ...b }))
  const index = new Map<DayKey, Bucket>()
  for (const b of buckets) for (const day of b.days) index.set(day, b)

  for (const e of events) {
    const b = index.get(e.day)
    if (b) b.xp += e.xp
  }
  for (const log of logs) {
    const b = index.get(toDayKey(log.at))
    if (!b) continue
    b.answers += 1
    if (isCorrect(log)) b.correct += 1
  }
  for (const b of buckets) b.accuracy = toPercent(b.correct, b.answers)
  return buckets
}

export interface PeriodSummary {
  xp: number
  activeDays: number
  answers: number
  accuracy: number | null
  /** Words reviewed for the very first time. */
  wordsStarted: number
  wordsAdded: number
  lessonsCompleted: number
  quizzes: number
  /** Average quiz score in percent; null without quizzes. */
  quizAverage: number | null
}

export interface PeriodRows {
  events: readonly ActivityEvent[]
  logs: readonly ReviewLog[]
  lessons: readonly LessonProgress[]
  quizzes: readonly QuizResult[]
}

/** Totals for the period. Rows must already be limited to it (except lessons). */
export function summarize(rows: PeriodRows, since: number): PeriodSummary {
  const { events, logs, lessons, quizzes } = rows
  const quizScores = quizzes.filter((q) => q.total > 0).map((q) => (q.correct / q.total) * 100)
  return {
    xp: events.reduce((sum, e) => sum + e.xp, 0),
    activeDays: new Set(events.map((e) => e.day)).size,
    answers: logs.length,
    accuracy: toPercent(logs.filter(isCorrect).length, logs.length),
    wordsStarted: logs.filter((l) => l.wasNew).length,
    wordsAdded: events.filter((e) => e.type === 'word_added').length,
    lessonsCompleted: lessons.filter((l) => (l.completedAt ?? -1) >= since).length,
    quizzes: quizzes.length,
    quizAverage:
      quizScores.length === 0
        ? null
        : Math.round(quizScores.reduce((s, n) => s + n, 0) / quizScores.length),
  }
}

export const STUDY_AREAS = ['review', 'words', 'grammar', 'quizzes', 'skills'] as const
export type StudyArea = (typeof STUDY_AREAS)[number]

const AREA_OF: Record<ActivityType, StudyArea> = {
  review: 'review',
  review_session: 'review',
  word_added: 'words',
  grammar_lesson: 'grammar',
  quiz: 'quizzes',
  reading: 'skills',
  listening: 'skills',
  speaking: 'skills',
  writing: 'skills',
  it_english: 'skills',
}

export interface AreaXp {
  area: StudyArea
  xp: number
}

/** Where the XP came from, biggest first. Areas without XP are left out. */
export function xpByArea(events: readonly ActivityEvent[]): AreaXp[] {
  const totals = new Map<StudyArea, number>()
  for (const e of events) {
    const area = AREA_OF[e.type]
    totals.set(area, (totals.get(area) ?? 0) + e.xp)
  }
  return STUDY_AREAS.map((area) => ({ area, xp: totals.get(area) ?? 0 }))
    .filter((a) => a.xp > 0)
    .toSorted((a, b) => b.xp - a.xp)
}

export interface MissedWord {
  wordId: string
  misses: number
  answers: number
}

/** Words forgotten most often in the period ("again" answers), worst first. */
export function mostMissed(logs: readonly ReviewLog[], limit = 5): MissedWord[] {
  const byWord = new Map<string, MissedWord>()
  for (const log of logs) {
    const entry = byWord.get(log.wordId) ?? { wordId: log.wordId, misses: 0, answers: 0 }
    entry.answers += 1
    if (!isCorrect(log)) entry.misses += 1
    byWord.set(log.wordId, entry)
  }
  return [...byWord.values()]
    .filter((w) => w.misses > 0)
    .toSorted((a, b) => b.misses - a.misses || b.misses / b.answers - a.misses / a.answers)
    .slice(0, limit)
}

/** Lessons practised but scored below the pass mark, weakest first. */
export function weakLessons(
  progress: readonly LessonProgress[],
  passScore: number,
  limit = 5,
): LessonProgress[] {
  return progress
    .filter((p) => p.bestScore !== undefined && p.bestScore < passScore)
    .toSorted((a, b) => (a.bestScore ?? 0) - (b.bestScore ?? 0))
    .slice(0, limit)
}

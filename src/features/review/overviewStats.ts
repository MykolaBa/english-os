import type { ReviewLog, Word } from '@/lib/db/types'
import { forecast, isDue, type ForecastDay } from './queue'
import { countIntroduced } from './reviewRepo'

const DAY = 86_400_000

export interface OverviewStats {
  due: number
  /** Due for more than a day. */
  overdue: number
  introducedToday: number
  answeredToday: number
  correctToday: number
  /** The soonest future review, or null when nothing is scheduled. */
  nextDue: number | null
  forecast: ForecastDay[]
}

/** Everything the review overview shows about the schedule, in one pass over the words. */
export function overviewStats(
  words: readonly Word[],
  todayLogs: ReviewLog[],
  now: number,
): OverviewStats {
  let due = 0
  let overdue = 0
  let nextDue: number | null = null
  for (const w of words) {
    if (isDue(w, now)) {
      due++
      if (w.srs.dueAt < now - DAY) overdue++
    } else if (w.srs.status !== 'new' && (nextDue === null || w.srs.dueAt < nextDue)) {
      nextDue = w.srs.dueAt
    }
  }
  return {
    due,
    overdue,
    introducedToday: countIntroduced(todayLogs),
    answeredToday: todayLogs.length,
    correctToday: todayLogs.filter((l) => l.rating !== 'again').length,
    nextDue,
    forecast: forecast(words, now),
  }
}

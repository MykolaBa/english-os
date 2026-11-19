import { addDays, startOfDay } from '@/lib/date'
import type { ReviewRating, SrsState } from '@/lib/db/types'

/**
 * Spaced repetition — a simplified SM-2.
 *
 * 1. A word's *first* successful answer uses fixed, configurable intervals
 *    (hard → 1 day, good → 3 days, easy → 7 days).
 * 2. After that, the interval grows by the word's *ease* (starts at 2.5):
 *    good → interval × ease, easy → × ease × 1.3, hard → × 1.2.
 * 3. "Again" means you forgot: the word comes back in ~10 minutes, its interval
 *    resets and its ease drops, so it will be shown more often from now on.
 *
 * Pure function: no dates read inside, `now` is passed in — easy to test and to replace
 * with a smarter algorithm (e.g. FSRS) later without touching the UI.
 */

export interface SrsConfig {
  againMinutes: number
  hardDays: number
  goodDays: number
  easyDays: number
}

export const DEFAULT_SRS_CONFIG: SrsConfig = {
  againMinutes: 10,
  hardDays: 1,
  goodDays: 3,
  easyDays: 7,
}

export const REVIEW_RATINGS = [
  'again',
  'hard',
  'good',
  'easy',
] as const satisfies readonly ReviewRating[]

const MIN_EASE = 1.3
const MAX_INTERVAL_DAYS = 365
/** A word reviewed successfully with a 3-week+ gap is considered learned. */
export const MASTERED_INTERVAL_DAYS = 21

const EASE_DELTA: Record<ReviewRating, number> = { again: -0.2, hard: -0.15, good: 0, easy: 0.15 }

function nextIntervalDays(
  srs: SrsState,
  rating: Exclude<ReviewRating, 'again'>,
  config: SrsConfig,
) {
  if (srs.intervalDays === 0) {
    return { hard: config.hardDays, good: config.goodDays, easy: config.easyDays }[rating]
  }
  const grown = {
    hard: srs.intervalDays * 1.2,
    good: srs.intervalDays * srs.ease,
    easy: srs.intervalDays * srs.ease * 1.3,
  }[rating]
  // Always move forward at least one day, never beyond a year.
  return Math.min(MAX_INTERVAL_DAYS, Math.max(srs.intervalDays + 1, Math.round(grown)))
}

export function schedule(
  srs: SrsState,
  rating: ReviewRating,
  now: number,
  config: SrsConfig = DEFAULT_SRS_CONFIG,
): SrsState {
  const correct = rating !== 'again'
  const ease = Math.max(MIN_EASE, Math.round((srs.ease + EASE_DELTA[rating]) * 100) / 100)
  const base = {
    ...srs,
    ease,
    reps: srs.reps + 1,
    lastReviewedAt: now,
    correctCount: srs.correctCount + (correct ? 1 : 0),
    incorrectCount: srs.incorrectCount + (correct ? 0 : 1),
  }

  if (rating === 'again') {
    return {
      ...base,
      status: 'learning',
      intervalDays: 0,
      // Forgetting a word you had already learned counts as a lapse.
      lapses: srs.lapses + (srs.intervalDays > 0 ? 1 : 0),
      dueAt: now + config.againMinutes * 60_000,
    }
  }

  const intervalDays = nextIntervalDays(srs, rating, config)
  return {
    ...base,
    status: intervalDays >= MASTERED_INTERVAL_DAYS ? 'mastered' : 'reviewing',
    intervalDays,
    // Due at the start of that day, so it's waiting for you in the morning.
    dueAt: startOfDay(addDays(new Date(now), intervalDays)).getTime(),
  }
}

/**
 * What each button would do — shown under the rating buttons ("10 min", "3 days").
 * Interval lengths depend only on the word's state, not on the current time.
 */
export function previewIntervals(
  srs: SrsState,
  config: SrsConfig = DEFAULT_SRS_CONFIG,
): Record<ReviewRating, { minutes: number } | { days: number }> {
  const days = (rating: Exclude<ReviewRating, 'again'>) =>
    schedule(srs, rating, 0, config).intervalDays
  return {
    again: { minutes: config.againMinutes },
    hard: { days: days('hard') },
    good: { days: days('good') },
    easy: { days: days('easy') },
  }
}

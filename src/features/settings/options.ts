import type { ReviewRating } from '@/lib/db/types'
import type { SrsConfig } from '@/lib/srs/scheduler'

export const GOALS = [20, 30, 50, 80, 120]
export const NEW_PER_DAY = [0, 5, 10, 15, 20, 30]

export const INTERVAL_FIELDS = [
  { key: 'againMinutes', options: [1, 5, 10, 30], unit: 'min' },
  { key: 'hardDays', options: [1, 2], unit: 'day' },
  { key: 'goodDays', options: [2, 3, 4, 5], unit: 'day' },
  { key: 'easyDays', options: [5, 7, 10, 14], unit: 'day' },
] as const satisfies ReadonlyArray<{
  key: keyof SrsConfig
  options: readonly number[]
  unit: 'min' | 'day'
}>

export const RATING_OF = {
  againMinutes: 'again',
  hardDays: 'hard',
  goodDays: 'good',
  easyDays: 'easy',
} as const satisfies Record<keyof SrsConfig, ReviewRating>

/**
 * The preset options plus the current value, sorted. A value restored from a backup (or
 * an older version) may not be a preset; without this the select would show nothing.
 */
export function withCurrent(options: readonly number[], current: number): number[] {
  return [...new Set([...options, current])].toSorted((a, b) => a - b)
}

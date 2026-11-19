import { addDays, fromDayKey, toDayKey, type DayKey } from '@/lib/date'

/**
 * Current streak = consecutive study days ending today.
 * If today has no activity yet, the streak is still "alive" from yesterday —
 * the user just hasn't studied *yet* today.
 */
export function computeCurrentStreak(
  activeDays: Iterable<DayKey>,
  today: Date = new Date(),
): number {
  const days = new Set(activeDays)
  let cursor = days.has(toDayKey(today)) ? today : addDays(today, -1)
  let streak = 0
  while (days.has(toDayKey(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Longest run of consecutive days anywhere in history. */
export function computeLongestStreak(activeDays: Iterable<DayKey>): number {
  const sorted = [...new Set(activeDays)].toSorted()
  let longest = 0
  let current = 0
  let prev: DayKey | undefined
  for (const day of sorted) {
    const isNext = prev !== undefined && toDayKey(addDays(fromDayKey(prev), 1)) === day
    current = isNext ? current + 1 : 1
    longest = Math.max(longest, current)
    prev = day
  }
  return longest
}

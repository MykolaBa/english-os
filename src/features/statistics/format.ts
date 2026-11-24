import { fromDayKey } from '@/lib/date'
import type { Bucket, StatPeriod } from './stats'

/** Short axis label: weekday for a week, date for a month, week start for three months. */
export function tickLabel(start: string, period: StatPeriod, locale: string): string {
  const date = fromDayKey(start)
  return period === 'week'
    ? date.toLocaleDateString(locale, { weekday: 'short' })
    : date.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

/** Full label for tooltips and the table: "Thursday, 19 November" or "Week of 13 Nov". */
export function bucketTitle(
  bucket: Pick<Bucket, 'start'>,
  period: StatPeriod,
  locale: string,
  weekOf: (date: string) => string,
): string {
  const date = fromDayKey(bucket.start)
  if (period === 'quarter') {
    return weekOf(date.toLocaleDateString(locale, { day: 'numeric', month: 'short' }))
  }
  return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
}

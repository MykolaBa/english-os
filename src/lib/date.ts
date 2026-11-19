/**
 * Date helpers. A "day key" is a local-time `YYYY-MM-DD` string.
 * We group learning activity by local day (not UTC), so a session at 23:30
 * counts for the day the user actually studied.
 */

export type DayKey = string

const pad = (n: number) => String(n).padStart(2, '0')

export function toDayKey(date: Date | number = new Date()): DayKey {
  const d = typeof date === 'number' ? new Date(date) : date
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromDayKey(key: DayKey): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/** Last `count` day keys ending with `end` (inclusive), oldest first. */
export function lastDays(count: number, end: Date = new Date()): DayKey[] {
  return Array.from({ length: count }, (_, i) => toDayKey(addDays(end, i - count + 1)))
}

export function weekdayShort(key: DayKey, locale = 'en-US'): string {
  return fromDayKey(key).toLocaleDateString(locale, { weekday: 'short' })
}

/** "5 min ago" / "5 хв тому" — localized by the browser's Intl API. */
export function formatRelative(
  timestamp: number,
  locale = 'en-US',
  justNow = 'just now',
  now: number = Date.now(),
): string {
  const diffSec = Math.round((timestamp - now) / 1000)
  if (Math.abs(diffSec) < 60) return justNow
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' })
  const diffMin = Math.round(diffSec / 60)
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')
  const diffH = Math.round(diffMin / 60)
  if (Math.abs(diffH) < 24) return rtf.format(diffH, 'hour')
  const diffD = Math.round(diffH / 24)
  if (Math.abs(diffD) < 7) return rtf.format(diffD, 'day')
  return new Date(timestamp).toLocaleDateString(locale, { month: 'short', day: 'numeric' })
}

export function formatDate(timestamp: number, locale = 'en-US'): string {
  return new Date(timestamp).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const DAY_MS = 86_400_000

/**
 * When something is due, in words: "in 10 min" later today, otherwise calendar days —
 * "tomorrow", "in 3 days" — so a word due on Sunday never reads as "in 2 days" on
 * Thursday evening.
 */
export function formatDue(
  timestamp: number,
  locale = 'en-US',
  justNow = 'just now',
  now: number = Date.now(),
): string {
  const days = Math.round(
    (startOfDay(new Date(timestamp)).getTime() - startOfDay(new Date(now)).getTime()) / DAY_MS,
  )
  if (days === 0) return formatRelative(timestamp, locale, justNow, now)
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day')
}

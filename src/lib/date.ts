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

export function weekdayShort(key: DayKey): string {
  return fromDayKey(key).toLocaleDateString('en-US', { weekday: 'short' })
}

export function formatRelative(timestamp: number, now: number = Date.now()): string {
  const diffSec = Math.round((now - timestamp) / 1000)
  if (diffSec < 60) return 'just now'
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `${diffH}h ago`
  const diffD = Math.round(diffH / 24)
  if (diffD < 7) return `${diffD}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

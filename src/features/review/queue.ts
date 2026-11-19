import { addDays, startOfDay, toDayKey, type DayKey } from '@/lib/date'
import type { Word } from '@/lib/db/types'

export interface QueueOptions {
  now: number
  /** How many brand-new words may still be introduced today. */
  newLimit: number
  collectionId?: string | null
}

export const isDue = (w: Word, now: number) => w.srs.status !== 'new' && w.srs.dueAt <= now

/**
 * Today's session order:
 * 1. Due words — the ones you forget most come first, then the most overdue.
 * 2. Then up to `newLimit` new words (newest first, matching the dashboard).
 */
export function buildQueue(words: Word[], { now, newLimit, collectionId }: QueueOptions): Word[] {
  const pool = collectionId ? words.filter((w) => w.collectionIds.includes(collectionId)) : words
  const due = pool
    .filter((w) => isDue(w, now))
    .toSorted((a, b) => b.srs.lapses - a.srs.lapses || a.srs.dueAt - b.srs.dueAt)
  const fresh = pool
    .filter((w) => w.srs.status === 'new')
    .toSorted((a, b) => b.createdAt - a.createdAt)
    .slice(0, Math.max(0, newLimit))
  return [...due, ...fresh]
}

export interface ForecastDay {
  day: DayKey
  count: number
}

/** How many words become due on each of the next `days` days (today includes overdue). */
export function forecast(words: Word[], now: number, days = 7): ForecastDay[] {
  const today = startOfDay(new Date(now))
  const result = Array.from({ length: days }, (_, i) => ({
    day: toDayKey(addDays(today, i)),
    count: 0,
  }))
  const index = new Map(result.map((d, i) => [d.day, i]))
  for (const w of words) {
    if (w.srs.status === 'new') continue
    const key = w.srs.dueAt <= now ? toDayKey(today) : toDayKey(w.srs.dueAt)
    const i = index.get(key)
    if (i !== undefined) result[i]!.count++
  }
  return result
}

/** ~8 s per known card, ~15 s per new one. */
export function estimateMinutes(due: number, fresh: number): number {
  return Math.max(1, Math.round((due * 8 + fresh * 15) / 60))
}

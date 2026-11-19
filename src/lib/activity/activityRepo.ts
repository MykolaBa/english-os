import { db } from '@/lib/db/db'
import type { ActivityEvent } from '@/lib/db/types'
import { toDayKey, type DayKey } from '@/lib/date'

export type NewActivity = Omit<ActivityEvent, 'id' | 'at' | 'day'> & { at?: number }

export async function logActivity(event: NewActivity): Promise<void> {
  const at = event.at ?? Date.now()
  await db.activity.add({ ...event, at, day: toDayKey(at) })
}

export function getActivitySince(timestamp: number): Promise<ActivityEvent[]> {
  return db.activity.where('at').aboveOrEqual(timestamp).toArray()
}

export function getRecentActivity(limit = 8): Promise<ActivityEvent[]> {
  return db.activity.orderBy('at').reverse().limit(limit).toArray()
}

/** All distinct days with at least one activity (cheap: reads only the index). */
export async function getActiveDays(): Promise<DayKey[]> {
  const keys = await db.activity.orderBy('day').uniqueKeys()
  return keys.filter((key): key is DayKey => typeof key === 'string')
}

export function sumXp(events: ActivityEvent[]): number {
  return events.reduce((total, e) => total + e.xp, 0)
}

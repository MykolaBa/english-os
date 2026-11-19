import type { ActivityEvent } from '@/lib/db/types'

export interface FeedItem {
  key: string
  type: ActivityEvent['type']
  /** Subject of the latest event in the group. */
  subject: string
  /** How many events were merged (e.g. 17 reviews in a row). */
  count: number
  xp: number
  at: number
}

/** Consecutive events of these types collapse into one feed line. */
const GROUPED: ReadonlySet<ActivityEvent['type']> = new Set(['review', 'word_added'])

/** Newest-first events → feed items, merging runs like 17 reviews into one line. */
export function groupFeed(events: ActivityEvent[], limit = 6): FeedItem[] {
  const items: FeedItem[] = []
  for (const e of events) {
    const last = items.at(-1)
    if (last && last.type === e.type && GROUPED.has(e.type) && last.at - e.at < 3 * 3_600_000) {
      last.count++
      last.xp += e.xp
      continue
    }
    if (items.length === limit) break
    items.push({
      key: String(e.id ?? e.at),
      type: e.type,
      subject: e.subject,
      count: 1,
      xp: e.xp,
      at: e.at,
    })
  }
  return items
}

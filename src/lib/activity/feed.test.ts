import { describe, expect, it } from 'vitest'
import type { ActivityEvent } from '@/lib/db/types'
import { groupFeed } from './feed'

const ev = (
  id: number,
  type: ActivityEvent['type'],
  at: number,
  subject = String(id),
): ActivityEvent => ({
  id,
  type,
  at,
  day: '2026-11-19',
  xp: 1,
  subject,
})

describe('groupFeed', () => {
  it('merges consecutive reviews and keeps other events apart', () => {
    const events = [
      ev(5, 'review', 50),
      ev(4, 'review', 40),
      ev(3, 'review', 30),
      ev(2, 'word_added', 20),
      ev(1, 'review', 10),
    ]
    const feed = groupFeed(events)
    expect(feed.map((i) => [i.type, i.count, i.xp])).toEqual([
      ['review', 3, 3],
      ['word_added', 1, 1],
      ['review', 1, 1],
    ])
    expect(feed[0]?.subject).toBe('5')
  })

  it('splits runs separated by more than three hours and respects the limit', () => {
    const hour = 3_600_000
    expect(groupFeed([ev(2, 'review', 5 * hour), ev(1, 'review', hour)])).toHaveLength(2)
    expect(groupFeed([ev(3, 'quiz', 3), ev(2, 'quiz', 2), ev(1, 'quiz', 1)], 2)).toHaveLength(2)
  })
})

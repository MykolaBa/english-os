import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { toDayKey } from '@/lib/date'
import { getActiveDays, getRecentActivity, logActivity } from './activityRepo'

describe('activityRepo', () => {
  beforeEach(async () => {
    await db.activity.clear()
  })

  it('stores events with a local day key and returns them newest first', async () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000
    await logActivity({ type: 'word_added', xp: 1, subject: 'deploy', at: yesterday })
    await logActivity({ type: 'review', xp: 1, subject: 'merge' })

    const recent = await getRecentActivity()
    expect(recent.map((e) => e.subject)).toEqual(['merge', 'deploy'])
    expect(recent[1]?.day).toBe(toDayKey(yesterday))
  })

  it('returns each active day once', async () => {
    await logActivity({ type: 'review', xp: 1, subject: 'a' })
    await logActivity({ type: 'review', xp: 1, subject: 'b' })
    expect(await getActiveDays()).toEqual([toDayKey()])
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { recordListening, XP_FIRST_LISTEN } from './listeningRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('recordListening', () => {
  it('keeps the best score and gives the completion bonus once', async () => {
    await recordListening('e1', 'Episode', { correct: 6, total: 7, mistakes: ['x'] }, 10)
    const second = await recordListening(
      'e1',
      'Episode',
      { correct: 3, total: 7, mistakes: [] },
      20,
    )
    expect(second).toMatchObject({ completedAt: 10, attempts: 2, bestScore: 86, lastScore: 43 })
    const xp = (await db.activity.orderBy('at').toArray()).map((e) => e.xp)
    expect(xp).toEqual([6 + XP_FIRST_LISTEN, 3])
  })
})

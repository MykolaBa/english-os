import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { recordReading, XP_FIRST_READ } from './readingRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('recordReading', () => {
  it('marks the text as read and keeps the best score', async () => {
    await recordReading('t1', 'Title', { correct: 3, total: 4, mistakes: ['q4'] }, 100)
    const second = await recordReading('t1', 'Title', { correct: 2, total: 4, mistakes: [] }, 200)
    expect(second).toEqual({
      textId: 't1',
      readAt: 100,
      attempts: 2,
      bestScore: 75,
      lastScore: 50,
      updatedAt: 200,
    })
  })

  it('gives the first-read bonus only once', async () => {
    await recordReading('t1', 'Title', { correct: 4, total: 4, mistakes: [] }, 100)
    await recordReading('t1', 'Title', { correct: 4, total: 4, mistakes: [] }, 200)
    const xp = (await db.activity.orderBy('at').toArray()).map((e) => e.xp)
    expect(xp).toEqual([4 + XP_FIRST_READ, 4])
    expect((await db.activity.toArray())[0]).toMatchObject({
      type: 'reading',
      subject: 'Title',
      refId: 't1',
    })
  })
})

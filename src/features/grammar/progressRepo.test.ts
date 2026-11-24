import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import {
  markOpened,
  recordAttempt,
  setCompleted,
  toggleBookmark,
  XP_FIRST_COMPLETION,
} from './progressRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('lesson progress', () => {
  it('starts a lesson once and tracks attempts, best score and mistakes', async () => {
    await markOpened('past-simple')
    await markOpened('past-simple')
    expect(await db.lessonProgress.count()).toBe(1)

    let p = await recordAttempt('past-simple', 'Past Simple', {
      correct: 4,
      total: 8,
      mistakes: ['a', 'b'],
    })
    expect(p).toMatchObject({
      status: 'in_progress',
      attempts: 1,
      lastScore: 50,
      bestScore: 50,
      lastMistakes: ['a', 'b'],
    })

    p = await recordAttempt('past-simple', 'Past Simple', { correct: 7, total: 8, mistakes: ['a'] })
    expect(p).toMatchObject({ status: 'completed', attempts: 2, bestScore: 88 })

    p = await recordAttempt('past-simple', 'Past Simple', { correct: 2, total: 8, mistakes: [] })
    expect(p.status).toBe('completed') // a weaker retry never "uncompletes"
    expect(p.bestScore).toBe(88)
  })

  it('gives the completion bonus only once', async () => {
    await recordAttempt('x', 'X', { correct: 8, total: 8, mistakes: [] })
    await recordAttempt('x', 'X', { correct: 8, total: 8, mistakes: [] })
    const xp = (await db.activity.toArray()).map((e) => e.xp)
    expect(xp).toEqual([8 + XP_FIRST_COMPLETION, 8])
  })

  it('toggles bookmarks and manual completion', async () => {
    await toggleBookmark('y')
    expect((await db.lessonProgress.get('y'))?.bookmarked).toBe(true)
    await setCompleted('y', true)
    expect((await db.lessonProgress.get('y'))?.status).toBe('completed')
    await setCompleted('y', false)
    expect((await db.lessonProgress.get('y'))?.completedAt).toBeUndefined()
  })
})

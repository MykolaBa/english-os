import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import {
  recordMockInterview,
  recordPhrasePractice,
  saveInterviewAnswer,
  XP_ANSWER_CONFIDENT,
  XP_ANSWER_WRITTEN,
} from './itRepo'
import { XP_PER_MOCK_QUESTION } from './mock'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

const xpLog = async () => (await db.activity.orderBy('at').toArray()).map((e) => e.xp)

describe('saveInterviewAnswer', () => {
  it('keeps the answer and status, and gives XP only for progress', async () => {
    await saveInterviewAnswer('q', 'Question?', { answer: '  ' }, 1)
    await saveInterviewAnswer('q', 'Question?', { answer: 'My answer' }, 2)
    await saveInterviewAnswer('q', 'Question?', { answer: 'My better answer' }, 3)
    await saveInterviewAnswer('q', 'Question?', { status: 'confident' }, 4)
    await saveInterviewAnswer('q', 'Question?', { status: 'practising' }, 5)
    const saved = await saveInterviewAnswer('q', 'Question?', { status: 'confident' }, 6)

    expect(saved).toEqual({
      questionId: 'q',
      answer: 'My better answer',
      status: 'confident',
      answeredAt: 2,
      confidentAt: 4,
      createdAt: 1,
      updatedAt: 6,
    })
    expect(await xpLog()).toEqual([XP_ANSWER_WRITTEN, XP_ANSWER_CONFIDENT])
  })
})

describe('recordPhrasePractice', () => {
  it('logs one XP per correct answer', async () => {
    await recordPhrasePractice(
      'standup',
      'Daily stand-up',
      { correct: 5, total: 6, mistakes: ['x'] },
      1,
    )
    expect(await db.activity.toArray()).toMatchObject([
      { type: 'it_english', xp: 5, subject: 'Daily stand-up', refId: 'standup' },
    ])
  })
})

describe('recordMockInterview', () => {
  it('gives XP per answered question and nothing for an empty interview', async () => {
    await recordMockInterview(0, 1)
    await recordMockInterview(3, 2)
    expect(await xpLog()).toEqual([3 * XP_PER_MOCK_QUESTION])
  })
})

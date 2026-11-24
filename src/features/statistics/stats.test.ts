import { describe, expect, it } from 'vitest'
import type { ActivityEvent, LessonProgress, QuizResult, ReviewLog } from '@/lib/db/types'
import {
  fillBuckets,
  makeBuckets,
  mostMissed,
  periodStart,
  summarize,
  weakLessons,
  xpByArea,
} from './stats'

const now = new Date(2026, 10, 19, 15, 0).getTime() // 19 Nov 2026, 15:00 local
const at = (day: number, hour = 12) => new Date(2026, 10, day, hour).getTime()

const event = (day: number, type: ActivityEvent['type'], xp: number): ActivityEvent => ({
  type,
  xp,
  at: at(day),
  day: `2026-11-${String(day).padStart(2, '0')}`,
  subject: '',
})

const log = (day: number, wordId: string, rating: ReviewLog['rating'], wasNew = false) =>
  ({ wordId, at: at(day), rating, mode: 'flashcard', wasNew }) satisfies ReviewLog

describe('makeBuckets', () => {
  it('cuts a week into 7 daily buckets ending today', () => {
    const buckets = makeBuckets('week', now)
    expect(buckets).toHaveLength(7)
    expect(buckets[0]?.start).toBe('2026-11-13')
    expect(buckets.at(-1)?.days).toEqual(['2026-11-19'])
  })

  it('groups three months into 13 weeks', () => {
    const buckets = makeBuckets('quarter', now)
    expect(buckets).toHaveLength(13)
    expect(buckets.every((b) => b.days.length === 7)).toBe(true)
    expect(buckets.at(-1)?.days.at(-1)).toBe('2026-11-19')
  })

  it('starts the period at midnight of the first bucket', () => {
    expect(periodStart('week', now)).toBe(new Date(2026, 10, 13).getTime())
  })
})

describe('fillBuckets', () => {
  it('sums XP and review accuracy per bucket', () => {
    const buckets = fillBuckets(
      makeBuckets('week', now),
      [event(19, 'review', 2), event(19, 'quiz', 8), event(1, 'review', 5)],
      [log(19, 'a', 'good'), log(19, 'b', 'again'), log(18, 'a', 'easy')],
    )
    const today = buckets.at(-1)
    expect(today).toMatchObject({ xp: 10, answers: 2, correct: 1, accuracy: 50 })
    expect(buckets.at(-2)?.accuracy).toBe(100)
    // A day without answers has no accuracy (a gap, not 0%).
    expect(buckets[0]?.accuracy).toBeNull()
    // Events outside the period are ignored.
    expect(buckets.reduce((s, b) => s + b.xp, 0)).toBe(10)
  })
})

describe('summarize', () => {
  it('totals the period', () => {
    const lessons: LessonProgress[] = [
      {
        lessonId: 'x',
        status: 'completed',
        bookmarked: false,
        attempts: 1,
        lastMistakes: [],
        completedAt: at(18),
        updatedAt: at(18),
      },
      {
        lessonId: 'y',
        status: 'completed',
        bookmarked: false,
        attempts: 1,
        lastMistakes: [],
        completedAt: at(1),
        updatedAt: at(1),
      },
    ]
    const quizzes = [
      { at: at(19), correct: 8, total: 10 },
      { at: at(18), correct: 5, total: 10 },
    ] as QuizResult[]
    const summary = summarize(
      {
        events: [event(18, 'word_added', 1), event(19, 'review', 2), event(19, 'review', 2)],
        logs: [log(19, 'a', 'good', true), log(19, 'b', 'again')],
        lessons,
        quizzes,
      },
      periodStart('week', now),
    )
    expect(summary).toEqual({
      xp: 5,
      activeDays: 2,
      answers: 2,
      accuracy: 50,
      wordsStarted: 1,
      wordsAdded: 1,
      lessonsCompleted: 1,
      quizzes: 2,
      quizAverage: 65,
    })
  })

  it('has no accuracy or quiz average without data', () => {
    const summary = summarize({ events: [], logs: [], lessons: [], quizzes: [] }, 0)
    expect(summary.accuracy).toBeNull()
    expect(summary.quizAverage).toBeNull()
  })
})

describe('xpByArea', () => {
  it('groups activity types into areas, biggest first, without empty ones', () => {
    const areas = xpByArea([
      event(19, 'review', 2),
      event(19, 'review_session', 5),
      event(19, 'grammar_lesson', 9),
      event(19, 'word_added', 0),
    ])
    expect(areas).toEqual([
      { area: 'grammar', xp: 9 },
      { area: 'review', xp: 7 },
    ])
  })
})

describe('mostMissed', () => {
  it('ranks words by "again" answers, then by miss rate', () => {
    const missed = mostMissed([
      log(19, 'a', 'again'),
      log(19, 'a', 'good'),
      log(19, 'b', 'again'),
      log(19, 'c', 'good'),
      log(18, 'd', 'again'),
      log(18, 'd', 'again'),
    ])
    expect(missed.map((w) => w.wordId)).toEqual(['d', 'b', 'a'])
    expect(missed[0]).toEqual({ wordId: 'd', misses: 2, answers: 2 })
  })
})

describe('weakLessons', () => {
  it('lists practised lessons below the pass mark, weakest first', () => {
    const p = (lessonId: string, bestScore?: number): LessonProgress => ({
      lessonId,
      status: 'in_progress',
      bookmarked: false,
      attempts: 1,
      lastMistakes: [],
      bestScore,
      updatedAt: 0,
    })
    expect(
      weakLessons([p('a', 60), p('b', 90), p('c'), p('d', 40)], 70).map((l) => l.lessonId),
    ).toEqual(['d', 'a'])
  })
})

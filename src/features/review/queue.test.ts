import { describe, expect, it } from 'vitest'
import type { Word } from '@/lib/db/types'
import { createInitialSrs } from '@/features/vocabulary/model'
import { buildPracticeQueue, buildQueue, estimateMinutes, forecast } from './queue'

const NOW = new Date(2026, 10, 19, 12).getTime()
const DAY = 86_400_000

function word(id: string, srs: Partial<Word['srs']> = {}, patch: Partial<Word> = {}): Word {
  return {
    id,
    term: id,
    translation: id,
    collectionIds: [],
    synonyms: [],
    antonyms: [],
    collocations: [],
    favorite: false,
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
    srs: { ...createInitialSrs(0), ...srs },
    ...patch,
  }
}

const words = [
  word('due-old', { status: 'reviewing', dueAt: NOW - 3 * DAY, intervalDays: 3 }),
  word('due-forgotten', { status: 'learning', dueAt: NOW - DAY, lapses: 2 }),
  word('later', { status: 'reviewing', dueAt: NOW + 2 * DAY, intervalDays: 3 }),
  word('new-a', {}, { createdAt: 1 }),
  word('new-b', {}, { createdAt: 2, collectionIds: ['it'] }),
]

describe('buildQueue', () => {
  it('puts often-forgotten due words first, then new words within the limit', () => {
    expect(buildQueue(words, { now: NOW, newLimit: 1 }).map((w) => w.id)).toEqual([
      'due-forgotten',
      'due-old',
      'new-b',
    ])
  })

  it('respects a zero limit and a collection filter', () => {
    expect(buildQueue(words, { now: NOW, newLimit: 0 })).toHaveLength(2)
    expect(
      buildQueue(words, { now: NOW, newLimit: 5, collectionId: 'it' }).map((w) => w.id),
    ).toEqual(['new-b'])
  })
})

describe('forecast', () => {
  it('counts overdue words today and future ones on their day', () => {
    const days = forecast(words, NOW, 3)
    expect(days.map((d) => d.count)).toEqual([2, 0, 1])
  })
})

describe('estimateMinutes', () => {
  it('rounds and never returns zero', () => {
    expect(estimateMinutes(0, 0)).toBe(1)
    expect(estimateMinutes(15, 4)).toBe(3)
  })
})

describe('buildPracticeQueue', () => {
  const learned = [
    word('solid', { status: 'reviewing', correctCount: 5, incorrectCount: 0, lastReviewedAt: 30 }),
    word('shaky', { status: 'learning', correctCount: 1, incorrectCount: 3, lastReviewedAt: 10 }),
    word('lapsed', {
      status: 'reviewing',
      correctCount: 3,
      incorrectCount: 1,
      lapses: 1,
      lastReviewedAt: 20,
    }),
    word('fresh'), // never reviewed — not part of practice
  ]

  it('uses only learned words, weakest first', () => {
    // shaky is 75% wrong, lapsed 25% wrong plus one lapse, solid never wrong
    expect(buildPracticeQueue(learned, { order: 'weakest', limit: null }).map((w) => w.id)).toEqual(
      ['shaky', 'lapsed', 'solid'],
    )
  })

  it('orders by last review and respects the limit', () => {
    expect(buildPracticeQueue(learned, { order: 'recent', limit: 2 }).map((w) => w.id)).toEqual([
      'solid',
      'lapsed',
    ])
  })

  it('shuffles with the given random source', () => {
    const ids = buildPracticeQueue(learned, { order: 'random', limit: null, random: () => 0 }).map(
      (w) => w.id,
    )
    expect(ids.toSorted()).toEqual(['lapsed', 'shaky', 'solid'])
    expect(ids).not.toContain('fresh')
  })
})

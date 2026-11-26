import { describe, expect, it } from 'vitest'
import type { ReviewLog, Word } from '@/lib/db/types'
import { createInitialSrs } from '@/features/vocabulary/model'
import { overviewStats } from './overviewStats'

const NOW = new Date(2026, 10, 19, 12).getTime()
const DAY = 86_400_000

const word = (id: string, srs: Partial<Word['srs']>): Word => ({
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
})

const log = (rating: ReviewLog['rating'], wasNew = false): ReviewLog => ({
  wordId: 'x',
  at: NOW,
  rating,
  mode: 'flashcards',
  wasNew,
})

describe('overviewStats', () => {
  it('counts due, overdue and the next review in one pass', () => {
    const stats = overviewStats(
      [
        word('new', { status: 'new', dueAt: 0 }),
        word('due', { status: 'learning', dueAt: NOW - 1000 }),
        word('late', { status: 'reviewing', dueAt: NOW - 3 * DAY }),
        word('soon', { status: 'reviewing', dueAt: NOW + 2 * DAY }),
        word('later', { status: 'mastered', dueAt: NOW + 9 * DAY }),
      ],
      [log('good', true), log('again')],
      NOW,
    )
    expect(stats).toMatchObject({
      due: 2,
      overdue: 1,
      nextDue: NOW + 2 * DAY,
      introducedToday: 1,
      answeredToday: 2,
      correctToday: 1,
    })
    expect(stats.forecast).toHaveLength(7)
  })

  it('has no next review when nothing is scheduled', () => {
    expect(overviewStats([word('new', { status: 'new' })], [], NOW).nextDue).toBeNull()
  })
})

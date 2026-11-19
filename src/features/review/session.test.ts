import { describe, expect, it } from 'vitest'
import type { Word } from '@/lib/db/types'
import { createInitialSrs } from '@/features/vocabulary/model'
import { completedCount, currentWord, sessionReducer, startSession, summarize } from './session'

const w = (id: string): Word => ({
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
  srs: createInitialSrs(0),
})

describe('review session', () => {
  it('moves through the queue and re-queues words answered "again"', () => {
    let s = startSession([w('a'), w('b')], 0)
    expect(currentWord(s)?.id).toBe('a')
    s = sessionReducer(s, { type: 'reveal' })
    expect(s.revealed).toBe(true)
    s = sessionReducer(s, { type: 'answered', rating: 'again', word: w('a') })
    expect(s.queue).toEqual(['b', 'a'])
    expect(s.revealed).toBe(false)
    expect(completedCount(s)).toBe(0)
    s = sessionReducer(s, { type: 'answered', rating: 'good', word: w('b') })
    s = sessionReducer(s, { type: 'answered', rating: 'hard', word: w('a') })
    expect(s.queue).toEqual([])
    expect(completedCount(s)).toBe(2)
    expect(summarize(s)).toEqual({ reviewed: 3, correct: 2, accuracy: 2 / 3, struggled: ['a'] })
  })

  it('ignores a stale answer for a word that is no longer on screen', () => {
    const s = startSession([w('a'), w('b')], 0)
    expect(sessionReducer(s, { type: 'answered', rating: 'good', word: w('b') })).toBe(s)
  })
})

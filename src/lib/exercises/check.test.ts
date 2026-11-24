import { describe, expect, it } from 'vitest'
import { checkExercise, matchesAny, normalizeGrammar, scorePercent, seededShuffle } from './check'
import type { Exercise } from './types'

describe('normalizeGrammar', () => {
  it('ignores case, punctuation and expands contractions', () => {
    expect(normalizeGrammar('I’ve ALREADY fixed it!')).toBe('i have already fixed it')
    expect(normalizeGrammar("They don't know")).toBe('they do not know')
    expect(normalizeGrammar("I won't, I can't")).toBe('i will not i cannot')
    expect(normalizeGrammar("'m talking")).toBe('am talking')
  })
})

describe('matchesAny', () => {
  it('is strict about grammar but not about contractions', () => {
    expect(matchesAny('works', ['works'])).toBe(true)
    expect(matchesAny('work', ['works'])).toBe(false)
    expect(matchesAny("doesn't use", ['does not use'])).toBe(true)
    expect(matchesAny("She's going to start", ['She is going to start'])).toBe(true)
    expect(matchesAny("She's gone", ['She has gone'])).toBe(true)
  })
})

describe('checkExercise', () => {
  const choice: Exercise = {
    id: 'c',
    type: 'choice',
    prompt: 'x',
    options: ['a', 'b'],
    answer: 1,
    explanation: '',
  }
  const gap: Exercise = {
    id: 'g',
    type: 'gap',
    prompt: 'She ___ here.',
    answers: ['works'],
    explanation: '',
  }
  const order: Exercise = {
    id: 'o',
    type: 'order',
    tokens: ['I', 'had', 'money'],
    answers: ['If I had money I would buy a car', 'I would buy a car if I had money'],
    explanation: '',
  }

  it('checks each exercise type', () => {
    expect(checkExercise(choice, 1)).toEqual({ correct: true, expected: 'b' })
    expect(checkExercise(choice, 0).correct).toBe(false)
    expect(checkExercise(gap, ' Works ')).toEqual({ correct: true, expected: 'works' })
    expect(checkExercise(gap, 0).correct).toBe(false)
    expect(checkExercise(order, 'I would buy a car if I had money').correct).toBe(true)
    expect(checkExercise(order, 'If I had money, I would buy a car.').correct).toBe(true)
  })

  it('scores attempts', () => {
    expect(scorePercent({ correct: 7, total: 8, mistakes: ['x'] })).toBe(88)
    expect(scorePercent({ correct: 0, total: 0, mistakes: [] })).toBe(0)
  })
})

describe('seededShuffle', () => {
  it('is stable for a seed and keeps every item', () => {
    const items = ['a', 'b', 'c', 'd', 'e']
    expect(seededShuffle(items, 'x')).toEqual(seededShuffle(items, 'x'))
    expect(seededShuffle(items, 'x').toSorted()).toEqual(items)
  })
})

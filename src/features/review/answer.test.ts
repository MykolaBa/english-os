import { describe, expect, it } from 'vitest'
import { checkAnswer, levenshtein, maskTerm, normalizeAnswer } from './answer'

describe('answer checking', () => {
  it('normalizes case, punctuation, apostrophes and spaces', () => {
    expect(normalizeAnswer('  I’d  Like To! ')).toBe("i'd like to")
  })

  it('computes edit distance', () => {
    expect(levenshtein('deploy', 'deploy')).toBe(0)
    expect(levenshtein('deploy', 'deplooy')).toBe(1)
    expect(levenshtein('kitten', 'sitting')).toBe(3)
  })

  it('accepts exact answers and forgives small typos', () => {
    expect(checkAnswer('Deploy', 'deploy')).toBe('correct')
    expect(checkAnswer('figure  out', 'figure out')).toBe('correct')
    expect(checkAnswer('deplooy', 'deploy')).toBe('typo')
    expect(checkAnswer('acommodation', 'accommodation')).toBe('typo')
    expect(checkAnswer('merge', 'deploy')).toBe('wrong')
    expect(checkAnswer('', 'deploy')).toBe('wrong')
    expect(checkAnswer('send', 'lend')).toBe('wrong')
    expect(checkAnswer('land', 'lend')).toBe('wrong')
    expect(checkAnswer('Lend', 'lend')).toBe('correct')
  })

  it('masks the word in its example sentence', () => {
    expect(maskTerm('I booked a hotel near the station.', 'booked')).toBe(
      'I _____ a hotel near the station.',
    )
    expect(maskTerm('Can I borrow your charger?', 'Borrow')).toBe('Can I _____ your charger?')
    expect(maskTerm('I found out the truth.', 'find out')).toBeNull()
    expect(maskTerm('A bookshelf.', 'book')).toBeNull() // whole words only
  })
})

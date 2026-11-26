import { describe, expect, it } from 'vitest'
import type { Word } from '@/lib/db/types'
import { analyzeText, countWords, lengthStatus, vocabularyUsed } from './analysis'

const word = (id: string, term: string) => ({ id, term }) as Word

describe('analyzeText', () => {
  it('counts words, sentences and variety', () => {
    const a = analyzeText('I fixed the bug. Then I wrote a test! Done?')
    expect(a.words).toBe(10)
    expect(a.sentences).toBe(3)
    expect(a.avgSentence).toBe(3)
    expect(a.variety).toBe(90) // "I" twice
  })

  it('finds long sentences and overused content words, not function words', () => {
    const long = `${'word '.repeat(26).trim()}.`
    const a = analyzeText(`${long} The bug is a bug, a real bug. The the the.`)
    expect(a.longSentences).toEqual([long])
    expect(a.overused).toEqual([
      { word: 'word', count: 26 },
      { word: 'bug', count: 3 },
    ])
  })

  it('handles an empty text', () => {
    expect(analyzeText('   ')).toMatchObject({ words: 0, sentences: 0, avgSentence: 0, variety: 0 })
  })

  it('counts contractions and hyphenated words as one word', () => {
    expect(countWords("I’m a front-end dev, it's fine")).toBe(6)
  })
})

describe('vocabularyUsed', () => {
  it('finds words in any simple form and phrases as written', () => {
    const vocabulary = new Map([
      ['deploy', word('1', 'deploy')],
      ['pull request', word('2', 'pull request')],
      ['queue', word('3', 'queue')],
    ])
    const used = vocabularyUsed('I deployed it and opened a Pull Request.', vocabulary)
    expect(used.map((w) => w.term)).toEqual(['deploy', 'pull request'])
  })
})

describe('lengthStatus', () => {
  it('compares the count with the range', () => {
    expect(lengthStatus(0, 50, 100)).toBe('empty')
    expect(lengthStatus(30, 50, 100)).toBe('short')
    expect(lengthStatus(80, 50, 100)).toBe('good')
    expect(lengthStatus(120, 50, 100)).toBe('long')
  })
})

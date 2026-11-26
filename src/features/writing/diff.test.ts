import { describe, expect, it } from 'vitest'
import { diffStats, diffWords, type DiffSegment } from './diff'

const side = (segments: DiffSegment[], keep: 'added' | 'removed') =>
  segments
    .filter((s) => s.type !== keep)
    .map((s) => s.text)
    .join('')

describe('diffWords', () => {
  it('marks changed words and rebuilds both texts', () => {
    const before = 'I fixed the bug yesterday.'
    const after = 'I fixed two bugs yesterday and wrote tests.'
    const d = diffWords(before, after)
    expect(side(d, 'removed')).toBe(after)
    expect(d).toEqual([
      { type: 'same', text: 'I fixed ' },
      { type: 'removed', text: 'the bug ' },
      { type: 'added', text: 'two bugs ' },
      { type: 'same', text: 'yesterday ' },
      { type: 'added', text: 'and wrote tests' },
      { type: 'same', text: '.' },
    ])
  })

  it('ignores a change of spacing alone', () => {
    expect(diffWords('Hello  world', 'Hello world')).toEqual([
      { type: 'same', text: 'Hello world' },
    ])
  })

  it('has a single same segment for equal texts', () => {
    expect(diffWords('same text', 'same text')).toEqual([{ type: 'same', text: 'same text' }])
  })

  it('works from and to an empty text', () => {
    expect(diffWords('', 'new words')).toEqual([{ type: 'added', text: 'new words' }])
    expect(diffWords('old words', '')).toEqual([{ type: 'removed', text: 'old words' }])
  })

  it('stays correct for long texts that skip the full comparison', () => {
    const a = Array.from({ length: 3000 }, (_, i) => `a${i}`).join(' ')
    const b = Array.from({ length: 3000 }, (_, i) => `b${i}`).join(' ')
    const d = diffWords(a, b)
    expect(side(d, 'removed')).toBe(b)
    expect(side(d, 'added').replace(/\s+/g, ' ')).toBe(a)
  })
})

describe('diffStats', () => {
  it('counts added and removed words', () => {
    expect(diffStats(diffWords('one two three', 'one four five three'))).toEqual({
      added: 2,
      removed: 1,
    })
  })
})

import { describe, expect, it } from 'vitest'
import { INTERVIEW_QUESTIONS, PHRASE_SETS } from './index'

const unique = (items: string[]) => new Set(items).size === items.length

describe('IT English content', () => {
  it('has unique ids', () => {
    expect(unique(PHRASE_SETS.map((s) => s.id))).toBe(true)
    expect(unique(INTERVIEW_QUESTIONS.map((q) => q.id))).toBe(true)
  })

  it('has no duplicate phrases (practice uses them as answer options)', () => {
    expect(unique(PHRASE_SETS.flatMap((s) => s.phrases.map((p) => p.en)))).toBe(true)
    expect(unique(PHRASE_SETS.flatMap((s) => s.phrases.map((p) => p.uk)))).toBe(true)
  })

  it('gives every set enough phrases for a practice round', () => {
    for (const set of PHRASE_SETS) expect(set.phrases.length).toBeGreaterThanOrEqual(4)
  })

  it('gives every question an outline, a sample answer and phrases', () => {
    for (const q of INTERVIEW_QUESTIONS) {
      expect(q.outline.length).toBeGreaterThan(0)
      expect(q.sample.length).toBeGreaterThan(80)
      expect(q.phrases.length).toBeGreaterThan(0)
    }
  })
})

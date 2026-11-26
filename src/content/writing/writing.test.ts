import { describe, expect, it } from 'vitest'
import { countWords } from '@/features/writing/analysis'
import { WRITING_PROMPTS } from './index'

describe('writing prompts', () => {
  it('have unique ids', () => {
    const ids = WRITING_PROMPTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  for (const p of WRITING_PROMPTS) {
    it(`"${p.id}" is consistent`, () => {
      expect(p.minWords).toBeLessThan(p.maxWords)
      // The model answer must itself meet the task's length.
      const words = countWords(p.sample)
      expect(words, `${p.id} sample has ${words} words`).toBeGreaterThanOrEqual(p.minWords)
      expect(words, `${p.id} sample has ${words} words`).toBeLessThanOrEqual(p.maxWords)
      const checklistIds = p.checklist.map((c) => c.id)
      expect(new Set(checklistIds).size).toBe(checklistIds.length)
      expect(p.phrases.length).toBeGreaterThan(0)
    })
  }
})

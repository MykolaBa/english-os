import { describe, expect, it } from 'vitest'
import { tokenizeParagraph } from '@/features/reading/tokenize'
import { READING_TEXTS } from './index'

describe('reading content', () => {
  it('has unique text and question ids', () => {
    const textIds = READING_TEXTS.map((t) => t.id)
    expect(new Set(textIds).size).toBe(textIds.length)
    const questionIds = READING_TEXTS.flatMap((t) => t.questions.map((q) => q.id))
    expect(new Set(questionIds).size).toBe(questionIds.length)
  })

  for (const text of READING_TEXTS) {
    describe(text.id, () => {
      it('uses every glossary item in the text', () => {
        const found = new Set(
          text.paragraphs.flatMap((p) =>
            tokenizeParagraph(p, text.glossary).flatMap((s) =>
              s.tokens.flatMap((t) => (t.kind === 'gloss' ? [t.index] : [])),
            ),
          ),
        )
        const missing = text.glossary.filter((_, i) => !found.has(i)).map((g) => g.term)
        expect(missing).toEqual([])
      })

      it('has questions with a valid answer', () => {
        expect(text.questions.length).toBeGreaterThan(0)
        for (const q of text.questions) {
          expect(q.id.startsWith(`${text.id}:`)).toBe(true)
          expect(q.options[q.answer]).toBeDefined()
          expect(new Set(q.options).size).toBe(q.options.length)
        }
      })
    })
  }
})

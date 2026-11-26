import { describe, expect, it } from 'vitest'
import { insertAt } from './insert'

describe('insertAt', () => {
  it('adds a space after a word and selects the placeholder', () => {
    const r = insertAt('Hello team.', 'I work as a …', 11)
    expect(r.text).toBe('Hello team. I work as a …')
    expect(r.text.slice(...r.selection)).toBe('…')
  })

  it('replaces a selection and puts the cursor after a phrase without placeholder', () => {
    const r = insertAt('Hi X!', 'everyone', 3, 4)
    expect(r.text).toBe('Hi everyone!')
    expect(r.selection).toEqual([11, 11])
  })

  it('does not add a space at the start or after whitespace', () => {
    expect(insertAt('', 'Hi', 0).text).toBe('Hi')
    expect(insertAt('Line\n', 'Next', 5).text).toBe('Line\nNext')
  })
})

import { describe, expect, it } from 'vitest'
import { getReadingText } from '@/content/reading'
import type { Word } from '@/lib/db/types'
import { draftFor, glossSentence, knownFor } from './selection'

const text = getReadingText('saturday-morning')!

describe('reading selection', () => {
  it('prefills a key word with its dictionary form, translation and sentence', () => {
    const index = text.glossary.findIndex((g) => g.term === 'realise')
    const draft = draftFor(text, {
      id: 'x',
      text: 'realised',
      sentence: 'At home, she realised that she had forgotten the eggs.',
      glossIndex: index,
    })
    expect(draft).toEqual({
      term: 'realise',
      translation: 'усвідомити, зрозуміти',
      partOfSpeech: 'verb',
      example: 'At home, she realised that she had forgotten the eggs.',
    })
  })

  it('prefills an ordinary word in lower case without a translation', () => {
    expect(
      draftFor(text, { id: 'x', text: 'Pancakes', sentence: 'Pancakes are great.' }),
    ).toMatchObject({
      term: 'pancakes',
      translation: '',
    })
  })

  it('finds the sentence a key word is used in', () => {
    const index = text.glossary.findIndex((g) => g.term === 'queue')
    expect(glossSentence(text, index)).toBe(
      'There was a long queue at the checkout, and only one cashier was working.',
    )
  })

  it('recognises a known word from an inflected form', () => {
    const word = { id: 'w1', term: 'pancake' } as Word
    const vocabulary = new Map([['pancake', word]])
    expect(knownFor(text, { id: 'x', text: 'pancakes', sentence: '' }, vocabulary)).toEqual({
      word,
      exact: false,
    })
    expect(knownFor(text, { id: 'x', text: 'Pancake', sentence: '' }, vocabulary)).toEqual({
      word,
      exact: true,
    })
  })

  it('keeps names and acronyms as written, lowercases a sentence opener', () => {
    const at = (word: string, sentence: string) =>
      draftFor(text, { id: 'x', text: word, sentence }).term
    expect(at('Many', 'Many teams ask.')).toBe('many')
    expect(at('DNS', 'It asks a DNS server.')).toBe('DNS')
    expect(at('Olena', 'On Saturday Olena woke up.')).toBe('Olena')
  })
})

import { describe, expect, it } from 'vitest'
import { lookupKeys, tokenizeParagraph, wordKey } from './tokenize'

const glossary = [
  { term: 'run out of', form: 'ran out of', translation: 'закінчитися' },
  { term: 'request', translation: 'запит' },
  { term: 'pull request', translation: 'пул-реквест' },
]

describe('tokenizeParagraph', () => {
  it('splits sentences and keeps every character', () => {
    const p = 'We ran out of time. Can you review my pull request? Thanks!'
    const sentences = tokenizeParagraph(p, glossary)
    expect(sentences.map((s) => s.text)).toEqual([
      'We ran out of time.',
      'Can you review my pull request?',
      'Thanks!',
    ])
    for (const s of sentences) expect(s.tokens.map((t) => t.text).join('')).toBe(s.text)
  })

  it('matches glossary phrases case-insensitively, longest first', () => {
    const [first, second] = tokenizeParagraph('Ran out of milk. A new pull request.', glossary)
    expect(first?.tokens[0]).toEqual({ kind: 'gloss', text: 'Ran out of', index: 0 })
    expect(second?.tokens.filter((t) => t.kind === 'gloss')).toEqual([
      { kind: 'gloss', text: 'pull request', index: 2 },
    ])
  })

  it('does not match inside other words', () => {
    const [s] = tokenizeParagraph('These requests are fine.', glossary)
    expect(s?.tokens.some((t) => t.kind === 'gloss')).toBe(false)
  })

  it('keeps apostrophes and hyphens inside words', () => {
    const [s] = tokenizeParagraph("It's a front-end team’s job.", [])
    expect(s?.tokens.filter((t) => t.kind === 'word').map((t) => t.text)).toEqual([
      "It's",
      'a',
      'front-end',
      'team’s',
      'job',
    ])
  })
})

describe('wordKey', () => {
  it('lowercases and normalizes the apostrophe', () => {
    expect(wordKey('Team’s')).toBe("team's")
  })
})

describe('lookupKeys', () => {
  it('guesses simple base forms', () => {
    expect(lookupKeys('Deploys')).toContain('deploy')
    expect(lookupKeys('fixed')).toContain('fix')
    expect(lookupKeys('realised')).toContain('realise')
    expect(lookupKeys('running')).toContain('run')
    expect(lookupKeys('stopped')).toContain('stop')
    expect(lookupKeys('libraries')).toContain('library')
    expect(lookupKeys('team’s')[0]).toBe('team')
  })
})

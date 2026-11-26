import { describe, expect, it } from 'vitest'
import type { LibraryItem, Word } from '@/lib/db/types'
import {
  guessTitle,
  coverage,
  filterLibrary,
  parseTags,
  safeUrl,
  splitParagraphs,
  tagsInUse,
  unknownWords,
} from './text'

const vocab = (...terms: string[]) => new Map(terms.map((t) => [t, { id: t, term: t } as Word]))

describe('safeUrl', () => {
  it('keeps web links and adds https to a bare domain', () => {
    expect(safeUrl(' https://react.dev/learn ')).toBe('https://react.dev/learn')
    expect(safeUrl('developer.mozilla.org')).toBe('https://developer.mozilla.org/')
  })
  it('refuses anything that could run code or isn’t a link', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull()
    expect(safeUrl('data:text/html,<script>')).toBeNull()
    expect(safeUrl('JaVaScRiPt:alert(1)')).toBeNull()
    expect(safeUrl('')).toBeNull()
    expect(safeUrl('http://')).toBeNull()
  })
})

describe('parseTags', () => {
  it('normalises, dedupes and caps', () => {
    expect(parseTags('React, docs ,react,, ')).toEqual(['react', 'docs'])
    expect(parseTags(Array.from({ length: 20 }, (_, i) => `t${i}`).join(','))).toHaveLength(10)
  })
})

describe('splitParagraphs', () => {
  it('joins hard-wrapped lines and splits on blank lines', () => {
    expect(splitParagraphs('One line\nwrapped here.\n\n  Second\r\n\r\npara.')).toEqual([
      'One line wrapped here.',
      'Second',
      'para.',
    ])
  })
})

describe('coverage and unknown words', () => {
  const text = 'The deployment failed. We rolled back the deployment and checked the logs.'
  it('counts known content words, ignoring function words', () => {
    // content words: deployment, failed, rolled, back, deployment, checked, logs → 7
    expect(coverage(text, vocab('deployment', 'log'))).toEqual({ words: 7, percent: 43 })
  })
  it('counts very common words as familiar', () => {
    expect(coverage(text, vocab(), new Set(['fail', 'back', 'check', 'log'])).percent).toBe(57)
  })
  it('groups forms of a word and keeps a heading out of the first sentence', () => {
    const unknown = unknownWords(
      'Friday deploys\n\nWe never deploy on Fridays. Friday is risky.',
      vocab(),
    )
    expect(unknown[0]).toEqual({ word: 'friday', count: 3, sentence: 'Friday deploys' })
    expect(unknown[1]).toMatchObject({ word: 'deploy', count: 2 })
  })
  it('lists unknown content words, most frequent first, with their sentence', () => {
    const unknown = unknownWords(text, vocab('log'))
    expect(unknown[0]).toEqual({ word: 'deployment', count: 2, sentence: 'The deployment failed.' })
    expect(unknown.map((u) => u.word)).not.toContain('logs') // known via its base form
    expect(unknown.map((u) => u.word)).not.toContain('the')
  })
})

describe('filterLibrary', () => {
  const item = (id: string, patch: Partial<LibraryItem>): LibraryItem => ({
    id,
    title: id,
    text: '',
    tags: [],
    status: 'toRead',
    notes: '',
    createdAt: 0,
    updatedAt: 0,
    ...patch,
  })
  const items = [
    item('React docs', { tags: ['react', 'docs'], status: 'reading' }),
    item('Email', { text: 'about the release', tags: ['work'] }),
  ]
  it('filters by text, status and tag', () => {
    expect(
      filterLibrary(items, { query: 'release', status: null, tag: null }).map((i) => i.id),
    ).toEqual(['Email'])
    expect(filterLibrary(items, { query: '', status: 'reading', tag: null })).toHaveLength(1)
    expect(filterLibrary(items, { query: '', status: null, tag: 'work' }).map((i) => i.id)).toEqual(
      ['Email'],
    )
  })
  it('lists tags by use', () => {
    expect(tagsInUse([...items, item('x', { tags: ['react'] })])).toEqual(['react', 'docs', 'work'])
  })
})

describe('guessTitle', () => {
  it('takes a short first line without a full stop', () => {
    expect(guessTitle('Deploying on Fridays\n\nMany teams avoid it.')).toBe('Deploying on Fridays')
    expect(guessTitle('Many teams avoid deploying on Fridays.\n\nMore.')).toBeNull()
    expect(guessTitle('')).toBeNull()
  })
})

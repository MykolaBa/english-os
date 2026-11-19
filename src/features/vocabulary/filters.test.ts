import { describe, expect, it } from 'vitest'
import type { Word } from '@/lib/db/types'
import {
  DEFAULT_FILTERS,
  filterWords,
  filtersFromParams,
  filtersToParams,
  sortWords,
} from './filters'
import { createInitialSrs } from './model'

function word(term: string, patch: Partial<Word> = {}): Word {
  return {
    id: term,
    term,
    translation: `uk-${term}`,
    collectionIds: [],
    synonyms: [],
    antonyms: [],
    collocations: [],
    favorite: false,
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
    srs: createInitialSrs(0),
    ...patch,
  }
}

const words = [
  word('deploy', { createdAt: 3, level: 'B1', collectionIds: ['it'], favorite: true }),
  word('Borrow', { createdAt: 1, level: 'A2', example: 'Can I borrow your pen?' }),
  word('agenda', {
    createdAt: 2,
    level: 'B1',
    srs: { ...createInitialSrs(0), status: 'learning', incorrectCount: 4 },
  }),
]

describe('filterWords', () => {
  it('searches term, translation and examples case-insensitively', () => {
    expect(filterWords(words, { ...DEFAULT_FILTERS, query: 'PEN' }).map((w) => w.term)).toEqual([
      'Borrow',
    ])
    expect(filterWords(words, { ...DEFAULT_FILTERS, query: 'uk-agenda' })).toHaveLength(1)
  })

  it('combines collection, level, status and favorites filters', () => {
    expect(filterWords(words, { ...DEFAULT_FILTERS, level: 'B1' })).toHaveLength(2)
    expect(
      filterWords(words, { ...DEFAULT_FILTERS, level: 'B1', status: 'learning' }),
    ).toHaveLength(1)
    expect(filterWords(words, { ...DEFAULT_FILTERS, collectionId: 'it' })[0]?.term).toBe('deploy')
    expect(filterWords(words, { ...DEFAULT_FILTERS, favoritesOnly: true })).toHaveLength(1)
  })
})

describe('sortWords', () => {
  it('sorts by date, alphabet and mistakes without mutating input', () => {
    expect(sortWords(words, 'newest').map((w) => w.term)).toEqual(['deploy', 'agenda', 'Borrow'])
    expect(sortWords(words, 'az').map((w) => w.term)).toEqual(['agenda', 'Borrow', 'deploy'])
    expect(sortWords(words, 'hardest')[0]?.term).toBe('agenda')
    expect(words[0]?.term).toBe('deploy')
  })
})

describe('URL params', () => {
  it('round-trips filters and ignores invalid values', () => {
    const filters = {
      ...DEFAULT_FILTERS,
      query: 'set',
      level: 'B2' as const,
      favoritesOnly: true,
      sort: 'az' as const,
    }
    expect(filtersFromParams(filtersToParams(filters))).toEqual(filters)
    expect(filtersFromParams(new URLSearchParams('status=bogus&sort=nope'))).toEqual(
      DEFAULT_FILTERS,
    )
  })
})

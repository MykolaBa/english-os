import { CEFR_LEVELS, type CefrLevel, type Word, type WordStatus } from '@/lib/db/types'
import { parseOneOf } from '@/lib/guards'

export const WORD_STATUSES = [
  'new',
  'learning',
  'reviewing',
  'mastered',
] as const satisfies readonly WordStatus[]
export const WORD_SORTS = ['newest', 'oldest', 'az', 'za', 'due', 'hardest'] as const
export type WordSort = (typeof WORD_SORTS)[number]

export interface WordFilters {
  query: string
  collectionId: string | null
  status: WordStatus | null
  level: CefrLevel | null
  favoritesOnly: boolean
  sort: WordSort
}

export const DEFAULT_FILTERS: WordFilters = {
  query: '',
  collectionId: null,
  status: null,
  level: null,
  favoritesOnly: false,
  sort: 'newest',
}

export function hasActiveFilters(f: WordFilters): boolean {
  return Boolean(f.query.trim() || f.collectionId || f.status || f.level || f.favoritesOnly)
}

function matchesQuery(word: Word, query: string): boolean {
  const haystack = [
    word.term,
    word.translation,
    word.definition,
    word.example,
    word.notes,
    ...word.synonyms,
    ...word.collocations,
  ]
  return haystack.some((text) => text?.toLowerCase().includes(query))
}

export function filterWords(words: Word[], f: WordFilters): Word[] {
  const query = f.query.trim().toLowerCase()
  return words.filter(
    (w) =>
      (!query || matchesQuery(w, query)) &&
      (!f.collectionId || w.collectionIds.includes(f.collectionId)) &&
      (!f.status || w.srs.status === f.status) &&
      (!f.level || w.level === f.level) &&
      (!f.favoritesOnly || w.favorite),
  )
}

const byTerm = (a: Word, b: Word) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })

/** Returns a new sorted array (`toSorted`); the input is never mutated. */
export function sortWords(words: Word[], sort: WordSort): Word[] {
  switch (sort) {
    case 'newest':
      return words.toSorted((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return words.toSorted((a, b) => a.createdAt - b.createdAt)
    case 'az':
      return words.toSorted(byTerm)
    case 'za':
      return words.toSorted((a, b) => byTerm(b, a))
    case 'due':
      return words.toSorted((a, b) => a.srs.dueAt - b.srs.dueAt)
    case 'hardest':
      return words.toSorted((a, b) => b.srs.incorrectCount - a.srs.incorrectCount || byTerm(a, b))
  }
}

/** Reads filters from URL search params, ignoring anything invalid. */
export function filtersFromParams(params: URLSearchParams): WordFilters {
  return {
    query: params.get('q') ?? '',
    collectionId: params.get('collection'),
    status: parseOneOf(WORD_STATUSES, params.get('status')),
    level: parseOneOf(CEFR_LEVELS, params.get('level')),
    favoritesOnly: params.get('fav') === '1',
    sort: parseOneOf(WORD_SORTS, params.get('sort')) ?? 'newest',
  }
}

export function filtersToParams(f: WordFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (f.query) params.set('q', f.query)
  if (f.collectionId) params.set('collection', f.collectionId)
  if (f.status) params.set('status', f.status)
  if (f.level) params.set('level', f.level)
  if (f.favoritesOnly) params.set('fav', '1')
  if (f.sort !== 'newest') params.set('sort', f.sort)
  return params
}

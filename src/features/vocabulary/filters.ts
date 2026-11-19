import { CEFR_LEVELS, type CefrLevel, type Word, type WordStatus } from '@/lib/db/types'

export const WORD_STATUSES: readonly WordStatus[] = ['new', 'learning', 'reviewing', 'mastered']
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

/** Returns a new sorted array; the input is not mutated. */
export function sortWords(words: Word[], sort: WordSort): Word[] {
  const list = [...words]
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => b.createdAt - a.createdAt)
    case 'oldest':
      return list.sort((a, b) => a.createdAt - b.createdAt)
    case 'az':
      return list.sort(byTerm)
    case 'za':
      return list.sort((a, b) => byTerm(b, a))
    case 'due':
      return list.sort((a, b) => a.srs.dueAt - b.srs.dueAt)
    case 'hardest':
      return list.sort((a, b) => b.srs.incorrectCount - a.srs.incorrectCount || byTerm(a, b))
  }
}

/** Reads filters from URL search params, ignoring anything invalid. */
export function filtersFromParams(params: URLSearchParams): WordFilters {
  const status = params.get('status')
  const level = params.get('level')
  const sort = params.get('sort')
  return {
    query: params.get('q') ?? '',
    collectionId: params.get('collection'),
    status: WORD_STATUSES.includes(status as WordStatus) ? (status as WordStatus) : null,
    level: CEFR_LEVELS.includes(level as CefrLevel) ? (level as CefrLevel) : null,
    favoritesOnly: params.get('fav') === '1',
    sort: WORD_SORTS.includes(sort as WordSort) ? (sort as WordSort) : 'newest',
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

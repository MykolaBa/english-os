/**
 * Persisted entities (what lives in IndexedDB).
 *
 * Rule of thumb: only *user data* is stored in the database — words, progress,
 * history. Static learning content (grammar lessons, reading texts, IT questions)
 * lives in `src/content` as code and is referenced by id.
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export const CEFR_LEVELS: readonly CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

/** `seed` = shipped with the app, `user` = created by the learner. */
export type RecordSource = 'seed' | 'user'

export type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrasal verb'
  | 'phrase'
  | 'idiom'
  | 'preposition'
  | 'conjunction'
  | 'pronoun'
  | 'other'

/** Spaced-repetition state of a single word. Updated by `lib/srs` (phase 3). */
export interface SrsState {
  status: WordStatus
  /** Epoch ms when the word is due for review. */
  dueAt: number
  intervalDays: number
  /** Ease multiplier (SM-2 style). Starts at 2.5. */
  ease: number
  reps: number
  lapses: number
  lastReviewedAt?: number
  correctCount: number
  incorrectCount: number
}

export interface Word {
  id: string
  term: string
  translation: string
  definition?: string
  phonetic?: string
  partOfSpeech?: PartOfSpeech
  example?: string
  exampleTranslation?: string
  level?: CefrLevel
  topic?: string
  collectionIds: string[]
  notes?: string
  synonyms: string[]
  antonyms: string[]
  collocations: string[]
  favorite: boolean
  source: RecordSource
  createdAt: number
  updatedAt: number
  srs: SrsState
}

export interface Collection {
  id: string
  name: string
  description?: string
  /** lucide icon name, purely presentational */
  icon?: string
  color?: string
  source: RecordSource
  createdAt: number
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export interface ReviewLog {
  id?: number
  wordId: string
  at: number
  rating: ReviewRating
  mode: string
  durationMs?: number
}

export type ActivityType =
  | 'word_added'
  | 'review'
  | 'review_session'
  | 'grammar_lesson'
  | 'quiz'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'writing'
  | 'it_english'

/**
 * Append-only learning journal. Every meaningful action writes one event.
 * Dashboard, streaks, statistics and XP are all *derived* from this table,
 * so modules never maintain their own counters.
 */
export interface ActivityEvent {
  id?: number
  type: ActivityType
  at: number
  /** Local day key (YYYY-MM-DD), indexed for fast per-day queries. */
  day: string
  xp: number
  durationSec?: number
  /**
   * What the event is about, e.g. the word for `word_added`. Stored language-neutral:
   * the feed builds the sentence from `type` + `subject` in the current UI language.
   */
  subject: string
  refId?: string
}

export interface MetaEntry {
  key: string
  value: unknown
}

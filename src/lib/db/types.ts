/**
 * Persisted entities (what lives in IndexedDB).
 *
 * Rule of thumb: only *user data* is stored in the database — words, progress,
 * history. Static learning content (grammar lessons, reading texts, IT questions)
 * lives in `src/content` as code and is referenced by id.
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export const CEFR_LEVELS = [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
] as const satisfies readonly CefrLevel[]

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
  /** True when this was the word's very first review (counts toward the daily new-word limit). */
  wasNew?: boolean
  /** Extra practice: counted for XP and history, but the schedule was left unchanged. */
  practice?: boolean
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

export type LessonStatus = 'in_progress' | 'completed'

/** Progress in one grammar lesson (lesson content itself lives in src/content). */
export interface LessonProgress {
  lessonId: string
  status: LessonStatus
  bookmarked: boolean
  attempts: number
  /** Percent, 0–100; undefined until the exercises were done once. */
  bestScore?: number
  lastScore?: number
  /** Exercise ids answered wrongly in the last attempt — for "review mistakes". */
  lastMistakes: string[]
  completedAt?: number
  updatedAt: number
}

/** Progress in one reading text (the text itself lives in src/content/reading). */
export interface ReadingProgress {
  textId: string
  /** Set once the comprehension questions were answered for the first time. */
  readAt?: number
  attempts: number
  /** Percent, 0–100, of the comprehension questions. */
  bestScore?: number
  lastScore?: number
  updatedAt: number
}

/** A saved snapshot of a piece of writing ("Save version"). */
export interface WritingVersion {
  at: number
  text: string
  words: number
}

/** A piece of the learner's own writing: a draft that autosaves, plus saved versions. */
export interface Writing {
  id: string
  /** The writing task it answers (src/content/writing), or null for free writing. */
  promptId: string | null
  title: string
  text: string
  /** Oldest first; capped (see WRITING_VERSIONS_MAX). */
  versions: WritingVersion[]
  /** Ids of the task's checklist items the learner ticked. */
  checked: string[]
  /** First time it was marked done; XP is given once. */
  completedAt?: number
  createdAt: number
  updatedAt: number
}

export const INTERVIEW_STATUSES = ['practising', 'confident'] as const
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number]

/** The learner's own answer to an interview question (the question lives in src/content/it). */
export interface InterviewAnswer {
  questionId: string
  answer: string
  status: InterviewStatus
  /** When an answer was first written / first marked confident: XP is given once for each. */
  answeredAt?: number
  confidentAt?: number
  createdAt: number
  updatedAt: number
}

export const QUIZ_SOURCES = ['mixed', 'vocabulary', 'grammar', 'mistakes'] as const
export type QuizSource = (typeof QUIZ_SOURCES)[number]

/** meaning: EN word → pick UA; word: UA → pick EN; typing: UA → type EN; context: fill the example. */
export const VOCAB_KINDS = ['meaning', 'word', 'typing', 'context'] as const
export type VocabKind = (typeof VOCAB_KINDS)[number]

/** Everything needed to rebuild a quiz exactly (generation is seeded). */
export interface QuizConfig {
  source: QuizSource
  count: number
  /** Vocabulary questions only from this collection (null = all words). */
  collectionId: string | null
  /** Grammar questions only from these lessons (empty = all lessons). */
  lessonIds: string[]
  vocabKinds: VocabKind[]
  seed: string
}

export interface QuizResult {
  id?: number
  at: number
  config: QuizConfig
  correct: number
  total: number
  /** Exercise ids answered wrongly. */
  mistakes: string[]
  durationSec: number
  /** The exact questions, so "repeat" gives the same quiz even after your data changed. */
  exerciseIds?: string[]
}

export interface MetaEntry {
  key: string
  value: unknown
}

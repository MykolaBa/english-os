import { z } from 'zod'
import { PARTS_OF_SPEECH, TEXT_MAX } from './limits'
import { REVIEW_RATINGS } from '@/lib/srs/scheduler'
import {
  CEFR_LEVELS,
  type ActivityEvent,
  type Collection,
  type LessonProgress,
  type QuizResult,
  type ReadingProgress,
  type InterviewAnswer,
  INTERVIEW_STATUSES,
  QUIZ_SOURCES,
  VOCAB_KINDS,
  type MetaEntry,
  type ReviewLog,
  type Word,
} from './types'

/**
 * Runtime schemas for everything stored in IndexedDB. Used to validate backups before a
 * single row is written. `satisfies z.ZodType<T>` keeps each schema in sync with its type:
 * change `Word` without changing `wordSchema` and the build fails.
 */

const WORD_STATUSES = ['new', 'learning', 'reviewing', 'mastered'] as const
const ACTIVITY_TYPES = [
  'word_added',
  'review',
  'review_session',
  'grammar_lesson',
  'quiz',
  'reading',
  'listening',
  'speaking',
  'writing',
  'it_english',
] as const satisfies readonly ActivityEvent['type'][]

const text = z.string().max(TEXT_MAX)
const optionalText = text.optional()
const timestamp = z.number().finite().nonnegative()
const count = z.number().int().nonnegative()

export const srsSchema = z.object({
  status: z.enum(WORD_STATUSES),
  dueAt: timestamp,
  intervalDays: z.number().nonnegative(),
  ease: z.number().min(1).max(5),
  reps: count,
  lapses: count,
  lastReviewedAt: timestamp.optional(),
  correctCount: count,
  incorrectCount: count,
})

export const wordSchema = z.object({
  id: z.string().min(1).max(200),
  term: z.string().min(1).max(200),
  translation: text,
  definition: optionalText,
  phonetic: optionalText,
  partOfSpeech: z.enum(PARTS_OF_SPEECH).optional(),
  example: optionalText,
  exampleTranslation: optionalText,
  level: z.enum(CEFR_LEVELS).optional(),
  topic: optionalText,
  collectionIds: z.array(z.string()),
  notes: optionalText,
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
  collocations: z.array(z.string()),
  favorite: z.boolean(),
  source: z.enum(['seed', 'user']),
  createdAt: timestamp,
  updatedAt: timestamp,
  srs: srsSchema,
}) satisfies z.ZodType<Word>

export const collectionSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  description: optionalText,
  icon: optionalText,
  color: optionalText,
  source: z.enum(['seed', 'user']),
  createdAt: timestamp,
}) satisfies z.ZodType<Collection>

export const reviewLogSchema = z.object({
  id: count.optional(),
  wordId: z.string().min(1),
  at: timestamp,
  rating: z.enum(REVIEW_RATINGS),
  mode: z.string(),
  durationMs: z.number().nonnegative().optional(),
  wasNew: z.boolean().optional(),
  practice: z.boolean().optional(),
}) satisfies z.ZodType<ReviewLog>

export const activitySchema = z.object({
  id: count.optional(),
  type: z.enum(ACTIVITY_TYPES),
  at: timestamp,
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  xp: z.number().int(),
  durationSec: z.number().nonnegative().optional(),
  subject: z.string(),
  refId: z.string().optional(),
}) satisfies z.ZodType<ActivityEvent>

export const metaSchema = z.object({
  key: z.string(),
  value: z.unknown(),
}) satisfies z.ZodType<MetaEntry>

export const lessonProgressSchema = z.object({
  lessonId: z.string().min(1).max(200),
  status: z.enum(['in_progress', 'completed']),
  bookmarked: z.boolean(),
  attempts: count,
  bestScore: z.number().min(0).max(100).optional(),
  lastScore: z.number().min(0).max(100).optional(),
  lastMistakes: z.array(z.string()),
  completedAt: timestamp.optional(),
  updatedAt: timestamp,
}) satisfies z.ZodType<LessonProgress>

export const readingProgressSchema = z.object({
  textId: z.string().min(1).max(200),
  readAt: timestamp.optional(),
  attempts: count,
  bestScore: z.number().min(0).max(100).optional(),
  lastScore: z.number().min(0).max(100).optional(),
  updatedAt: timestamp,
}) satisfies z.ZodType<ReadingProgress>

export const interviewAnswerSchema = z.object({
  questionId: z.string().min(1).max(200),
  answer: z.string().max(20_000),
  status: z.enum(INTERVIEW_STATUSES),
  answeredAt: timestamp.optional(),
  confidentAt: timestamp.optional(),
  createdAt: timestamp,
  updatedAt: timestamp,
}) satisfies z.ZodType<InterviewAnswer>

export const quizResultSchema = z.object({
  id: count.optional(),
  at: timestamp,
  config: z.object({
    source: z.enum(QUIZ_SOURCES),
    count: z.number().int().min(1).max(200),
    collectionId: z.string().nullable(),
    lessonIds: z.array(z.string()),
    vocabKinds: z.array(z.enum(VOCAB_KINDS)),
    seed: z.string().max(100),
  }),
  correct: count,
  total: count,
  mistakes: z.array(z.string()),
  durationSec: z.number().nonnegative(),
  exerciseIds: z.array(z.string()).optional(),
}) satisfies z.ZodType<QuizResult>

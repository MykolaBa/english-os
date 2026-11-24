import Dexie, { type EntityTable } from 'dexie'
import type {
  ActivityEvent,
  Collection,
  LessonProgress,
  MetaEntry,
  InterviewAnswer,
  QuizResult,
  ReadingProgress,
  ReviewLog,
  Word,
} from './types'

/**
 * The single IndexedDB database of the app.
 *
 * Schema changes: never edit an existing `version(n)` block once released —
 * add `version(n + 1)` with the new stores and an `.upgrade()` if data must move.
 * Index syntax: first entry = primary key, `++` = auto-increment, `*` = multi-entry (arrays).
 */
export class EnglishOSDatabase extends Dexie {
  words!: EntityTable<Word, 'id'>
  collections!: EntityTable<Collection, 'id'>
  reviewLogs!: EntityTable<ReviewLog, 'id'>
  activity!: EntityTable<ActivityEvent, 'id'>
  meta!: EntityTable<MetaEntry, 'key'>
  lessonProgress!: EntityTable<LessonProgress, 'lessonId'>
  quizResults!: EntityTable<QuizResult, 'id'>
  readingProgress!: EntityTable<ReadingProgress, 'textId'>
  interviewAnswers!: EntityTable<InterviewAnswer, 'questionId'>

  constructor(name = 'englishos') {
    super(name)
    this.version(1).stores({
      words: 'id, term, createdAt, *collectionIds, srs.dueAt, srs.status, source',
      collections: 'id, name, source',
      reviewLogs: '++id, wordId, at',
      activity: '++id, type, at, day',
      meta: 'key',
    })
    // v2 (phase 5): grammar lesson progress. Only new stores are listed; existing data is
    // untouched, so users upgrade in place without losing anything.
    this.version(2).stores({
      lessonProgress: 'lessonId, status, updatedAt',
    })
    // v3 (phase 6): quiz history.
    this.version(3).stores({
      quizResults: '++id, at',
    })
    // v4 (phase 7): reading progress.
    this.version(4).stores({
      readingProgress: 'textId, readAt, updatedAt',
    })
    // v5 (phase 7): your answers to interview questions.
    this.version(5).stores({
      interviewAnswers: 'questionId, status, updatedAt',
    })
  }
}

export const db = new EnglishOSDatabase()

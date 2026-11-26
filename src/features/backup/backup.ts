import { z } from 'zod'
import { db } from '@/lib/db/db'
import {
  activitySchema,
  collectionSchema,
  lessonProgressSchema,
  quizResultSchema,
  readingProgressSchema,
  interviewAnswerSchema,
  writingSchema,
  listeningProgressSchema,
  libraryItemSchema,
  metaSchema,
  reviewLogSchema,
  wordSchema,
} from '@/lib/db/schemas'
import { currentSettings, sanitizeSettings, useSettings } from '@/stores/settingsStore'

/** Bump when the file layout changes; older files must stay readable. */
export const BACKUP_FORMAT = 1

const backupSchema = z.object({
  app: z.literal('englishos'),
  format: z.number().int().positive(),
  exportedAt: z.string(),
  data: z.object({
    words: z.array(wordSchema),
    collections: z.array(collectionSchema),
    reviewLogs: z.array(reviewLogSchema),
    activity: z.array(activitySchema),
    meta: z.array(metaSchema),
    /** Added with database v2; missing in older backups. */
    lessonProgress: z.array(lessonProgressSchema).default([]),
    /** Added with database v3. */
    quizResults: z.array(quizResultSchema).default([]),
    /** Added with database v4. */
    readingProgress: z.array(readingProgressSchema).default([]),
    /** Added with database v5. */
    interviewAnswers: z.array(interviewAnswerSchema).default([]),
    /** Added with database v6. */
    writings: z.array(writingSchema).default([]),
    /** Added with database v8 (v7's recordings are never in backups). */
    listeningProgress: z.array(listeningProgressSchema).default([]),
    /** Added with database v9. */
    library: z.array(libraryItemSchema).default([]),
  }),
  settings: z.unknown().optional(),
})

export type Backup = z.infer<typeof backupSchema>

export async function createBackup(now = new Date()): Promise<Backup> {
  const [
    words,
    collections,
    reviewLogs,
    activity,
    meta,
    lessonProgress,
    quizResults,
    readingProgress,
    interviewAnswers,
    writings,
    listeningProgress,
    library,
  ] = await Promise.all([
    db.words.toArray(),
    db.collections.toArray(),
    db.reviewLogs.toArray(),
    db.activity.toArray(),
    db.meta.toArray(),
    db.lessonProgress.toArray(),
    db.quizResults.toArray(),
    db.readingProgress.toArray(),
    db.interviewAnswers.toArray(),
    db.writings.toArray(),
    db.listeningProgress.toArray(),
    db.library.toArray(),
  ])
  return {
    app: 'englishos',
    format: BACKUP_FORMAT,
    exportedAt: now.toISOString(),
    data: {
      words,
      collections,
      reviewLogs,
      activity,
      meta,
      lessonProgress,
      quizResults,
      readingProgress,
      interviewAnswers,
      writings,
      listeningProgress,
      library,
    },
    settings: currentSettings(),
  }
}

/** Remember when the last backup was made (for the reminder). */
export { getLastBackupAt, markBackupMade } from './backupMeta'

export type BackupProblem = 'invalidJson' | 'notBackup' | 'newerFormat' | 'invalidData'

export type ParsedBackup =
  | { ok: true; backup: Backup; summary: { words: number; reviews: number; exportedAt: string } }
  | { ok: false; problem: BackupProblem; detail?: string }

/** Validates a backup file completely before anything touches the database. */
export function parseBackup(text: string): ParsedBackup {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, problem: 'invalidJson' }
  }
  if (
    typeof json !== 'object' ||
    json === null ||
    (json as { app?: unknown }).app !== 'englishos'
  ) {
    return { ok: false, problem: 'notBackup' }
  }
  const format = (json as { format?: unknown }).format
  if (typeof format === 'number' && format > BACKUP_FORMAT)
    return { ok: false, problem: 'newerFormat' }

  const parsed = backupSchema.safeParse(json)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return { ok: false, problem: 'invalidData', detail: issue ? issue.path.join('.') : undefined }
  }
  const { data, exportedAt } = parsed.data
  return {
    ok: true,
    backup: parsed.data,
    summary: { words: data.words.length, reviews: data.reviewLogs.length, exportedAt },
  }
}

/**
 * Replaces all learning data with the backup in one transaction — if anything fails,
 * the database is left exactly as it was. Settings are applied field by field.
 */
export async function restoreBackup(backup: Backup): Promise<void> {
  const { data } = backup
  const tables = [
    db.words,
    db.collections,
    db.reviewLogs,
    db.activity,
    db.meta,
    db.lessonProgress,
    db.quizResults,
    db.readingProgress,
    db.interviewAnswers,
    db.writings,
    db.listeningProgress,
    db.library,
  ]
  await db.transaction('rw', tables, async () => {
    await Promise.all(tables.map((table) => table.clear()))
    await db.words.bulkAdd(data.words)
    await db.collections.bulkAdd(data.collections)
    await db.reviewLogs.bulkAdd(data.reviewLogs)
    await db.activity.bulkAdd(data.activity)
    await db.meta.bulkAdd(data.meta)
    await db.lessonProgress.bulkAdd(data.lessonProgress)
    await db.quizResults.bulkAdd(data.quizResults)
    await db.readingProgress.bulkAdd(data.readingProgress)
    await db.interviewAnswers.bulkAdd(data.interviewAnswers)
    await db.writings.bulkAdd(data.writings)
    await db.listeningProgress.bulkAdd(data.listeningProgress)
    await db.library.bulkAdd(data.library)
  })
  useSettings.getState().update(sanitizeSettings(backup.settings))
}

import { z } from 'zod'
import { db } from '@/lib/db/db'
import {
  activitySchema,
  collectionSchema,
  metaSchema,
  reviewLogSchema,
  wordSchema,
} from '@/lib/db/schemas'
import { currentSettings, sanitizeSettings, useSettings } from '@/stores/settingsStore'

/** Bump when the file layout changes; older files must stay readable. */
export const BACKUP_FORMAT = 1
const LAST_BACKUP_KEY = 'backup.lastAt'

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
  }),
  settings: z.unknown().optional(),
})

export type Backup = z.infer<typeof backupSchema>

export async function createBackup(now = new Date()): Promise<Backup> {
  const [words, collections, reviewLogs, activity, meta] = await Promise.all([
    db.words.toArray(),
    db.collections.toArray(),
    db.reviewLogs.toArray(),
    db.activity.toArray(),
    db.meta.toArray(),
  ])
  return {
    app: 'englishos',
    format: BACKUP_FORMAT,
    exportedAt: now.toISOString(),
    data: { words, collections, reviewLogs, activity, meta },
    settings: currentSettings(),
  }
}

/** Remember when the last backup was made (for the reminder). */
export async function markBackupMade(now = Date.now()): Promise<void> {
  await db.meta.put({ key: LAST_BACKUP_KEY, value: now })
}

export async function getLastBackupAt(): Promise<number | null> {
  const value = (await db.meta.get(LAST_BACKUP_KEY))?.value
  return typeof value === 'number' ? value : null
}

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
  const { words, collections, reviewLogs, activity, meta } = backup.data
  await db.transaction(
    'rw',
    [db.words, db.collections, db.reviewLogs, db.activity, db.meta],
    async () => {
      await Promise.all([
        db.words.clear(),
        db.collections.clear(),
        db.reviewLogs.clear(),
        db.activity.clear(),
        db.meta.clear(),
      ])
      await db.words.bulkAdd(words)
      await db.collections.bulkAdd(collections)
      await db.reviewLogs.bulkAdd(reviewLogs)
      await db.activity.bulkAdd(activity)
      await db.meta.bulkAdd(meta)
    },
  )
  useSettings.getState().update(sanitizeSettings(backup.settings))
}

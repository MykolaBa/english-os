import { db } from '@/lib/db/db'

/**
 * When the last backup was downloaded. Kept apart from backup.ts, so the dashboard's
 * "time for a backup" reminder doesn't load the validation schemas (zod).
 */
const LAST_BACKUP_KEY = 'backup.lastAt'

export async function markBackupMade(now = Date.now()): Promise<void> {
  await db.meta.put({ key: LAST_BACKUP_KEY, value: now })
}

export async function getLastBackupAt(): Promise<number | null> {
  const value = (await db.meta.get(LAST_BACKUP_KEY))?.value
  return typeof value === 'number' ? value : null
}

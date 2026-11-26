import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import { RECORDINGS_PER_ITEM } from '@/lib/db/limits'
import type { Recording, RecordingKind, SelfRating } from '@/lib/db/types'
import { createId } from '@/lib/id'

/** XP: a shadowed sentence is quick; a monologue of 20 s or more is real speaking practice. */
export const XP_SHADOWING = 1
export const XP_TASK_SHORT = 2
export const XP_TASK = 5
export const TASK_FULL_MS = 20_000

export const speakingXp = (kind: RecordingKind, durationMs: number) =>
  kind === 'shadowing' ? XP_SHADOWING : durationMs >= TASK_FULL_MS ? XP_TASK : XP_TASK_SHORT

interface NewRecording {
  kind: RecordingKind
  itemId: string
  audio: Blob
  mimeType: string
  durationMs: number
}

/**
 * Saves a take and its XP in one transaction, then keeps only the newest few takes of
 * that sentence or task (audio is large; older takes have done their job).
 */
export async function saveRecording(
  input: NewRecording,
  subject: string,
  now = Date.now(),
): Promise<Recording> {
  return db.transaction('rw', db.recordings, db.activity, async () => {
    const recording: Recording = { ...input, id: createId(), createdAt: now }
    await db.recordings.add(recording)
    const takes = await db.recordings.where('itemId').equals(input.itemId).sortBy('createdAt')
    const extra = takes.slice(0, Math.max(0, takes.length - RECORDINGS_PER_ITEM))
    await db.recordings.bulkDelete(extra.map((r) => r.id))
    await logActivity({
      type: 'speaking',
      xp: speakingXp(input.kind, input.durationMs),
      subject,
      refId: input.itemId,
      at: now,
    })
    return recording
  })
}

export async function rateRecording(id: string, rating: SelfRating) {
  await db.recordings.update(id, { rating })
}

export async function deleteRecording(id: string) {
  await db.recordings.delete(id)
}

/** Takes of these items, newest first, grouped by item id. */
export async function recordingsByItem(itemIds: readonly string[]) {
  const rows = await db.recordings
    .where('itemId')
    .anyOf([...itemIds])
    .toArray()
  const byItem = new Map<string, Recording[]>()
  for (const r of rows.toSorted((a, b) => b.createdAt - a.createdAt)) {
    byItem.set(r.itemId, [...(byItem.get(r.itemId) ?? []), r])
  }
  return byItem
}

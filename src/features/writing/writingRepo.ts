import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import { WRITING_MAX, WRITING_TITLE_MAX, WRITING_VERSIONS_MAX } from '@/lib/db/limits'
import type { Writing, WritingVersion } from '@/lib/db/types'
import { createId } from '@/lib/id'
import { countWords } from './analysis'

/** XP for finishing a piece: a base plus a little for length, capped — once per piece. */
export const XP_WRITING_BASE = 10
export const XP_WRITING_LENGTH_MAX = 20
export const writingXp = (words: number) =>
  XP_WRITING_BASE + Math.min(XP_WRITING_LENGTH_MAX, Math.floor(words / 10))

export async function createWriting(promptId: string | null, now = Date.now()): Promise<string> {
  const id = createId()
  await db.writings.add({
    id,
    promptId,
    // Empty title: the UI shows the task's title or "Untitled" in the current language.
    title: '',
    text: '',
    versions: [],
    checked: [],
    createdAt: now,
    updatedAt: now,
  })
  return id
}

type DraftChange = Partial<Pick<Writing, 'text' | 'title' | 'checked'>>

/** Autosave: keeps the draft, no version, no XP. Over-long input is cut to the limits. */
export async function saveDraft(id: string, change: DraftChange, now = Date.now()) {
  const patch: Partial<Writing> = { updatedAt: now }
  if (change.text !== undefined) patch.text = change.text.slice(0, WRITING_MAX)
  if (change.title !== undefined) patch.title = change.title.slice(0, WRITING_TITLE_MAX)
  if (change.checked !== undefined) patch.checked = change.checked
  await db.writings.update(id, patch)
}

/** Appends a snapshot unless the text is empty or unchanged since the last one. */
function withVersion(writing: Writing, now: number): WritingVersion[] {
  const last = writing.versions.at(-1)
  if (!writing.text.trim() || last?.text === writing.text) return writing.versions
  const next = [
    ...writing.versions,
    { at: now, text: writing.text, words: countWords(writing.text) },
  ]
  return next.slice(-WRITING_VERSIONS_MAX)
}

/** "Save version": returns false when there was nothing new to save. */
export async function saveVersion(id: string, now = Date.now()): Promise<boolean> {
  return db.transaction('rw', db.writings, async () => {
    const writing = await db.writings.get(id)
    if (!writing) return false
    const versions = withVersion(writing, now)
    if (versions === writing.versions) return false
    await db.writings.update(id, { versions, updatedAt: now })
    return true
  })
}

/** Brings an old version back. The current text is saved as a version first, so it's undoable. */
export async function restoreVersion(id: string, at: number, now = Date.now()) {
  await db.transaction('rw', db.writings, async () => {
    const writing = await db.writings.get(id)
    const version = writing?.versions.find((v) => v.at === at)
    if (!writing || !version) return
    await db.writings.update(id, {
      versions: withVersion(writing, now),
      text: version.text,
      updatedAt: now,
    })
  })
}

/**
 * Marks the piece done: saves a final version and, the first time only, logs the XP —
 * in one transaction, so it's never done without its XP or the other way round.
 * Returns the XP earned (0 when it was already done).
 */
export async function completeWriting(id: string, subject: string, now = Date.now()) {
  return db.transaction('rw', db.writings, db.activity, async () => {
    const writing = await db.writings.get(id)
    if (!writing || !writing.text.trim()) return 0
    const first = writing.completedAt === undefined
    await db.writings.update(id, {
      versions: withVersion(writing, now),
      completedAt: writing.completedAt ?? now,
      updatedAt: now,
    })
    if (!first) return 0
    const xp = writingXp(countWords(writing.text))
    await logActivity({ type: 'writing', xp, subject, refId: id, at: now })
    return xp
  })
}

/**
 * Removes a piece that was opened but never written in (no text, title or versions, not
 * done), so looking at a task doesn't leave an empty draft behind. Returns true if removed.
 */
export async function discardIfEmpty(id: string): Promise<boolean> {
  return db.transaction('rw', db.writings, async () => {
    const w = await db.writings.get(id)
    if (!w || w.text.trim() || w.title.trim() || w.versions.length > 0 || w.completedAt) {
      return false
    }
    await db.writings.delete(id)
    return true
  })
}

export async function deleteWriting(id: string) {
  await db.writings.delete(id)
}

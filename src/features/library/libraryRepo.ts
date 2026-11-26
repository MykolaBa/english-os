import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import { LIBRARY_TEXT_MAX, LIBRARY_TITLE_MAX, TEXT_MAX } from '@/lib/db/limits'
import type { LibraryItem, LibraryStatus } from '@/lib/db/types'
import { createId } from '@/lib/id'
import { parseTags, safeUrl } from './text'

/** What the add/edit form works with: plain strings, like the inputs. */
export interface LibraryDraft {
  title: string
  url: string
  text: string
  tags: string
  notes: string
}

export const EMPTY_LIBRARY_DRAFT: LibraryDraft = {
  title: '',
  url: '',
  text: '',
  tags: '',
  notes: '',
}

export type LibraryDraftError = 'needContent' | 'badUrl'

/** A link that isn't http(s), or neither text nor link, can't be saved. */
export function validateLibraryDraft(d: LibraryDraft): LibraryDraftError | null {
  if (d.url.trim() && !safeUrl(d.url)) return 'badUrl'
  if (!d.text.trim() && !d.url.trim()) return 'needContent'
  return null
}

/** The title you typed, else the text's first words, else the link's site. */
export function titleFor(d: LibraryDraft): string {
  const own = d.title.trim()
  if (own) return own.slice(0, LIBRARY_TITLE_MAX)
  const words = d.text.trim().split(/\s+/).filter(Boolean)
  if (words.length) return words.slice(0, 8).join(' ') + (words.length > 8 ? '…' : '')
  const url = safeUrl(d.url)
  return url ? new URL(url).hostname : '—'
}

function fields(d: LibraryDraft) {
  return {
    title: titleFor(d),
    url: safeUrl(d.url) ?? undefined,
    text: d.text.trim().slice(0, LIBRARY_TEXT_MAX),
    tags: parseTags(d.tags),
    notes: d.notes.trim().slice(0, TEXT_MAX),
  }
}

export async function addLibraryItem(d: LibraryDraft, now = Date.now()): Promise<string> {
  const id = createId()
  await db.library.add({ ...fields(d), id, status: 'toRead', createdAt: now, updatedAt: now })
  return id
}

export async function updateLibraryItem(id: string, d: LibraryDraft, now = Date.now()) {
  const f = fields(d)
  // `url: undefined` must remove a link that was cleared, so it is set explicitly.
  await db.library.update(id, { ...f, url: f.url, updatedAt: now })
}

/** XP for finishing a text: a little more for longer ones, given once per item. */
export const libraryXp = (words: number) => 5 + Math.min(15, Math.floor(words / 100))

/** Changes the status; the first "done" logs XP in the same transaction. Returns the XP. */
export async function setLibraryStatus(id: string, status: LibraryStatus, now = Date.now()) {
  return db.transaction('rw', db.library, db.activity, async () => {
    const item = await db.library.get(id)
    if (!item) return 0
    const firstDone = status === 'done' && item.readAt === undefined
    await db.library.update(id, {
      status,
      readAt: item.readAt ?? (status === 'done' ? now : undefined),
      updatedAt: now,
    })
    if (!firstDone) return 0
    const xp = libraryXp(item.text.split(/\s+/).filter(Boolean).length)
    await logActivity({ type: 'reading', xp, subject: item.title, refId: id, at: now })
    return xp
  })
}

export async function deleteLibraryItem(id: string) {
  await db.library.delete(id)
}

export const itemToDraft = (i: LibraryItem): LibraryDraft => ({
  title: i.title,
  url: i.url ?? '',
  text: i.text,
  tags: i.tags.join(', '),
  notes: i.notes,
})

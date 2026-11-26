import { getWritingPrompt } from '@/content/writing'
import type { Writing } from '@/lib/db/types'

/**
 * What a piece is called: its own title, else its task's title, else null (the UI then
 * says "Untitled" in the current language). Stored titles stay as the learner typed them.
 */
export function writingTitle(writing: Pick<Writing, 'title' | 'promptId'>): string | null {
  const own = writing.title.trim()
  if (own) return own
  return writing.promptId ? (getWritingPrompt(writing.promptId)?.title ?? null) : null
}

/** The activity-feed subject: language-neutral, so the title or the first few words. */
export function activitySubject(writing: Pick<Writing, 'title' | 'promptId' | 'text'>): string {
  const title = writingTitle(writing)
  if (title) return title
  const words = writing.text.trim().split(/\s+/)
  return words.slice(0, 6).join(' ') + (words.length > 6 ? '…' : '')
}

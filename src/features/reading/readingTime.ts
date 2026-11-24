import type { ReadingText } from '@/content/reading'

/** A learner reads slower than a native speaker: about 120 words a minute. */
const WORDS_PER_MINUTE = 120

export function readingMinutes(text: ReadingText): number {
  const words = text.paragraphs.join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

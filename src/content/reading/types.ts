import type { CefrLevel, PartOfSpeech } from '@/lib/db/types'
import type { ChoiceExercise } from '@/lib/exercises/types'

export const READING_TOPICS = ['everyday', 'work', 'it'] as const
export type ReadingTopic = (typeof READING_TOPICS)[number]

/** A key word or phrase of the text, with an accurate Ukrainian translation. */
export interface GlossaryItem {
  /** Dictionary form, saved to the vocabulary ("run out of"). */
  term: string
  /** How it appears in the text if different ("ran out of"); matched case-insensitively. */
  form?: string
  translation: string
  partOfSpeech?: PartOfSpeech
}

/**
 * One graded text. The text is English; `summary` and question explanations are Ukrainian.
 * Add a text: create a file in `texts/`, then list it in `index.ts`. Ids are stable —
 * saved progress refers to them.
 */
export interface ReadingText {
  id: string
  title: string
  level: CefrLevel
  topic: ReadingTopic
  /** One line, Ukrainian: what the text is about. */
  summary: string
  paragraphs: string[]
  glossary: GlossaryItem[]
  /** Comprehension questions, run on the shared exercise engine. */
  questions: ChoiceExercise[]
}

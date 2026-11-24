import type { CefrLevel } from '@/lib/db/types'
import type { Exercise } from '@/lib/exercises/types'

/** Categories from the course plan; labels live in i18n (`t.grammar.categories`). */
export const GRAMMAR_CATEGORIES = [
  'tenses',
  'modals',
  'conditionals',
  'passive',
  'reportedSpeech',
  'articles',
  'prepositions',
  'gerundInfinitive',
  'comparison',
  'relativeClauses',
  'questions',
] as const
export type GrammarCategory = (typeof GRAMMAR_CATEGORIES)[number]

/** An English sentence with its Ukrainian translation. */
export interface Example {
  en: string
  uk: string
}

/**
 * One grammar lesson. Explanations are Ukrainian (the learner is A2–B1), the language
 * itself is English. Add a lesson: create a file in `lessons/`, then list it in `index.ts`.
 */
export interface GrammarLesson {
  /** Stable id, used in URLs and saved progress — never change it once published. */
  id: string
  title: string
  level: CefrLevel
  category: GrammarCategory
  /** One line, Ukrainian. */
  summary: string
  /** Short Ukrainian explanation, a few paragraphs. */
  explanation: string[]
  /** The same idea in simple English. */
  simpleEnglish: string
  /** Formulas with examples (affirmative, negative, questions…). */
  forms: { label: string; formula: string; examples: Example[] }[]
  /** When to use it, one situation per item. */
  usage: { title: string; example: Example }[]
  mistakes: { wrong: string; right: string; why: string }[]
  /** Comparison with a similar structure or a tricky detail. */
  comparison?: { title: string; text: string; examples: Example[] }
  exercises: Exercise[]
}

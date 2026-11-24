import type { CefrLevel } from '@/lib/db/types'

/** An English phrase with an accurate Ukrainian equivalent (not a word-for-word copy). */
export interface Phrase {
  en: string
  uk: string
  /** Optional Ukrainian note: when to use it, register, a common mistake. */
  note?: string
}

/** A work situation and the phrases that get you through it. Ids are stable. */
export interface PhraseSet {
  id: string
  title: string
  /** One line, Ukrainian. */
  summary: string
  phrases: Phrase[]
}

export const INTERVIEW_KINDS = ['behavioural', 'technical'] as const
export type InterviewKind = (typeof INTERVIEW_KINDS)[number]

/** A common interview question with a model answer to learn from. Ids are stable. */
export interface InterviewQuestion {
  id: string
  question: string
  kind: InterviewKind
  level: CefrLevel
  /** Ukrainian: what the interviewer actually wants to hear. */
  tip: string
  /** English: the points a strong answer covers, in order. */
  outline: string[]
  /** English: a short model answer for a junior/middle frontend developer. */
  sample: string
  phrases: Phrase[]
}

import type { CefrLevel } from '@/lib/db/types'

export const WRITING_KINDS = ['everyday', 'work', 'it'] as const
export type WritingKind = (typeof WRITING_KINDS)[number]

/** A point to check before calling the text done (Ukrainian, short). Ids are stable. */
export interface ChecklistItem {
  id: string
  text: string
}

/**
 * A writing task. The task text and checklist are Ukrainian (they explain); phrases and
 * the sample are English. Ids are stable: saved writing refers to them.
 */
export interface WritingPrompt {
  id: string
  title: string
  kind: WritingKind
  level: CefrLevel
  /** Ukrainian: what to write, for whom, and why. */
  task: string
  minWords: number
  maxWords: number
  phrases: { en: string; uk: string }[]
  checklist: ChecklistItem[]
  /** English: one good answer to compare with, not to copy. */
  sample: string
}

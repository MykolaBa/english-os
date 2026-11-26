import type { CefrLevel } from '@/lib/db/types'
import type { ChoiceExercise } from '@/lib/exercises/types'

export const LISTENING_TOPICS = ['everyday', 'work', 'it'] as const
export type ListeningTopic = (typeof LISTENING_TOPICS)[number]

/** Who says a line: one of two people in a dialogue, or a single narrator. */
export type Speaker = 'A' | 'B' | 'N'

export interface ScriptLine {
  speaker: Speaker
  en: string
  uk: string
}

/** A word to catch by ear: `word` appears once, as a whole word, in `lines[line]`. */
export interface DictationItem {
  id: string
  line: number
  word: string
}

/**
 * A short listening episode, voiced by the browser's speech synthesis (two voices for a
 * dialogue). Ids are stable: progress and exercise ids refer to them.
 */
export interface ListeningEpisode {
  id: string
  title: string
  level: CefrLevel
  topic: ListeningTopic
  /** Ukrainian: who is talking and about what. */
  summary: string
  /** Names shown next to the lines (English). */
  speakers: Partial<Record<Speaker, string>>
  lines: ScriptLine[]
  dictation: DictationItem[]
  questions: ChoiceExercise[]
}

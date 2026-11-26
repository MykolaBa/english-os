import type { CefrLevel } from '@/lib/db/types'

/** A sentence to listen to and repeat. Ids are stable: recordings refer to them. */
export interface ShadowSentence {
  id: string
  en: string
  uk: string
  /** Ukrainian: what to listen for in this sentence (stress, linking, intonation). */
  note?: string
}

/** Sentences that train one pronunciation point. */
export interface ShadowingSet {
  id: string
  title: string
  /** Ukrainian: the point, explained in two or three sentences. */
  focus: string
  sentences: ShadowSentence[]
}

/** Speak for a minute or two on a topic, with a plan. Ids are stable. */
export interface SpeakingTask {
  id: string
  title: string
  level: CefrLevel
  /** How long to aim for. */
  seconds: number
  /** Ukrainian: the situation and what to talk about. */
  prompt: string
  /** English: the points of a good answer, in order. */
  points: string[]
  phrases: { en: string; uk: string }[]
}

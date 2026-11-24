import { conditionals } from './lessons/conditionals'
import { passiveVoice } from './lessons/passiveVoice'
import { pastSimple } from './lessons/pastSimple'
import { presentPerfect } from './lessons/presentPerfect'
import { presentSimpleContinuous } from './lessons/presentSimpleContinuous'
import { willGoingTo } from './lessons/willGoingTo'
import type { GrammarLesson } from './types'

/** The course in study order. New lessons: add the file, then list it here. */
export const GRAMMAR_LESSONS: readonly GrammarLesson[] = [
  presentSimpleContinuous,
  pastSimple,
  willGoingTo,
  presentPerfect,
  conditionals,
  passiveVoice,
]

const BY_ID = new Map(GRAMMAR_LESSONS.map((lesson) => [lesson.id, lesson]))

export const getLesson = (id: string): GrammarLesson | undefined => BY_ID.get(id)

export type { Example, GrammarCategory, GrammarLesson } from './types'
export { GRAMMAR_CATEGORIES } from './types'

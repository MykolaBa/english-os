import { SHADOWING_SETS } from './shadowing'
import { SPEAKING_TASKS } from './tasks'

export { SHADOWING_SETS } from './shadowing'
export { SPEAKING_TASKS } from './tasks'
export type { ShadowingSet, ShadowSentence, SpeakingTask } from './types'

const SETS = new Map(SHADOWING_SETS.map((s) => [s.id, s]))
const TASKS = new Map(SPEAKING_TASKS.map((t) => [t.id, t]))

export const getShadowingSet = (id: string) => SETS.get(id)
export const getSpeakingTask = (id: string) => TASKS.get(id)

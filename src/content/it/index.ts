import { INTERVIEW_QUESTIONS } from './interview'
import { PHRASE_SETS } from './phrases'

export { INTERVIEW_QUESTIONS } from './interview'
export { PHRASE_SETS } from './phrases'
export type { InterviewKind, InterviewQuestion, Phrase, PhraseSet } from './types'
export { INTERVIEW_KINDS } from './types'

const QUESTIONS = new Map(INTERVIEW_QUESTIONS.map((q) => [q.id, q]))
const SETS = new Map(PHRASE_SETS.map((s) => [s.id, s]))

export const getInterviewQuestion = (id: string) => QUESTIONS.get(id)
export const getPhraseSet = (id: string) => SETS.get(id)

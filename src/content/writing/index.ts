import { WRITING_PROMPTS } from './prompts'

export { WRITING_PROMPTS } from './prompts'
export type { ChecklistItem, WritingKind, WritingPrompt } from './types'
export { WRITING_KINDS } from './types'

const BY_ID = new Map(WRITING_PROMPTS.map((p) => [p.id, p]))

export const getWritingPrompt = (id: string) => BY_ID.get(id)

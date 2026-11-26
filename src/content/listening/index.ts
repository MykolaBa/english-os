import { LISTENING_EPISODES } from './episodes'

export { LISTENING_EPISODES } from './episodes'
export type { DictationItem, ListeningEpisode, ListeningTopic, ScriptLine, Speaker } from './types'
export { LISTENING_TOPICS } from './types'

const BY_ID = new Map(LISTENING_EPISODES.map((e) => [e.id, e]))

export const getListeningEpisode = (id: string) => BY_ID.get(id)

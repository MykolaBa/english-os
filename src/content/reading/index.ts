import { codeReview } from './texts/codeReview'
import { firstWeek } from './texts/firstWeek'
import { howAWebsiteLoads } from './texts/howAWebsiteLoads'
import { lookingForAFlat } from './texts/lookingForAFlat'
import { saturdayMorning } from './texts/saturdayMorning'
import { statusUpdate } from './texts/statusUpdate'
import type { ReadingText } from './types'

/** Texts from easiest to hardest. New text: add the file, then list it here. */
export const READING_TEXTS: readonly ReadingText[] = [
  saturdayMorning,
  firstWeek,
  lookingForAFlat,
  statusUpdate,
  howAWebsiteLoads,
  codeReview,
]

const BY_ID = new Map(READING_TEXTS.map((text) => [text.id, text]))

export const getReadingText = (id: string): ReadingText | undefined => BY_ID.get(id)

export type { GlossaryItem, ReadingText, ReadingTopic } from './types'
export { READING_TOPICS } from './types'

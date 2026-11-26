import type { Word } from '@/lib/db/types'

/**
 * Matching an English word as written ("deploys", "fixed") to a saved vocabulary entry
 * ("deploy", "fix"). Used by reading (tap a word) and writing (words you used).
 */

/** "Deploys," → "deploys": the key used to look a tapped word up in the vocabulary. */
export const wordKey = (text: string) => text.toLowerCase().replace(/’/g, "'")

/**
 * Keys to try when looking a tapped word up in the vocabulary: the word itself, then
 * simple base forms ("deploys" → "deploy", "fixed" → "fix", "running" → "run").
 * A rough guess on purpose — no dictionary is shipped; a miss only means no match.
 */
export function lookupKeys(text: string): string[] {
  const key = wordKey(text).replace(/'s$/, '')
  const keys = [key]
  const add = (k: string) => k.length > 1 && !keys.includes(k) && keys.push(k)
  if (key.endsWith('ies')) add(`${key.slice(0, -3)}y`)
  if (key.endsWith('es')) add(key.slice(0, -2))
  if (key.endsWith('s')) add(key.slice(0, -1))
  if (key.endsWith('ied')) add(`${key.slice(0, -3)}y`)
  if (key.endsWith('ed')) {
    add(key.slice(0, -2))
    add(key.slice(0, -1))
  }
  if (key.endsWith('ing')) {
    add(key.slice(0, -3))
    add(`${key.slice(0, -3)}e`)
  }
  // Doubled final consonant: "stopped" → "stop", "running" → "run".
  const stem = key.replace(/(ed|ing)$/, '')
  if (stem !== key && /([b-df-hj-np-tv-z])\1$/.test(stem)) add(stem.slice(0, -1))
  return keys
}

/** The learner's word for a tapped form, if any ("deploys" finds "deploy"). */
export const findKnownWord = (text: string, vocabulary: Map<string, Word>): Word | undefined =>
  lookupKeys(text)
    .map((k) => vocabulary.get(k))
    .find((w) => w !== undefined)

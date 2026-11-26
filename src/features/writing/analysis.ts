import type { Word } from '@/lib/db/types'
import { findKnownWord, wordKey } from '@/lib/text/lemma'
import { STOPWORDS } from '@/lib/text/stopwords'

/**
 * Plain, explainable feedback on a text — no AI: counts, long sentences, words you
 * repeat a lot, and which of your own vocabulary words you used.
 */

const WORD = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g
/** A sentence ends with . ! ? (optionally followed by a closing quote or bracket). */
const SENTENCE = /[^.!?]+[.!?]*["”’)]?/g

/** Over this many words a sentence is hard to follow — worth splitting. */
export const LONG_SENTENCE = 25
/** A content word used this many times or more is worth a synonym. */
export const OVERUSED_MIN = 3

export const countWords = (text: string) => text.match(WORD)?.length ?? 0

export interface TextAnalysis {
  words: number
  sentences: number
  /** Words per sentence, rounded; 0 for an empty text. */
  avgSentence: number
  /** Sentences over LONG_SENTENCE words, as written. */
  longSentences: string[]
  /** Distinct words / all words, in percent. */
  variety: number
  /** Content words repeated OVERUSED_MIN+ times, most repeated first. */
  overused: { word: string; count: number }[]
}

export function analyzeText(text: string): TextAnalysis {
  const words = (text.match(WORD) ?? []).map(wordKey)
  const sentences = (text.match(SENTENCE) ?? [])
    .map((s) => s.trim())
    .filter((s) => countWords(s) > 0)
  const counts = new Map<string, number>()
  for (const w of words) if (!STOPWORDS.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1)

  return {
    words: words.length,
    sentences: sentences.length,
    avgSentence: sentences.length === 0 ? 0 : Math.round(words.length / sentences.length),
    longSentences: sentences.filter((s) => countWords(s) > LONG_SENTENCE),
    variety: words.length === 0 ? 0 : Math.round((new Set(words).size / words.length) * 100),
    overused: [...counts]
      .filter(([, n]) => n >= OVERUSED_MIN)
      .map(([word, count]) => ({ word, count }))
      .toSorted((a, b) => b.count - a.count || a.word.localeCompare(b.word)),
  }
}

/**
 * Your vocabulary words that appear in the text — single words in any simple form
 * ("deployed" counts for "deploy"), phrases as written ("pull request").
 */
export function vocabularyUsed(text: string, vocabulary: Map<string, Word>): Word[] {
  const found = new Map<string, Word>()
  for (const w of text.match(WORD) ?? []) {
    const word = findKnownWord(w, vocabulary)
    if (word) found.set(word.id, word)
  }
  const normalized = ` ${wordKey(text)
    .replace(/[^a-z'’\s-]/g, ' ')
    .replace(/\s+/g, ' ')} `
  for (const [key, word] of vocabulary) {
    if (key.includes(' ') && normalized.includes(` ${key} `)) found.set(word.id, word)
  }
  return [...found.values()].toSorted((a, b) => a.term.localeCompare(b.term))
}

/** Where the word count is against the task's range. */
export type LengthStatus = 'empty' | 'short' | 'good' | 'long'

export function lengthStatus(words: number, min: number, max: number): LengthStatus {
  if (words === 0) return 'empty'
  if (words < min) return 'short'
  return words > max ? 'long' : 'good'
}

import { createRng, shuffleWith } from './random'
import type { Exercise, ExerciseResponse, OrderExercise } from './types'

/**
 * Grammar answers are checked strictly — "work" vs "works" *is* the point — but
 * fairly: case, punctuation, spacing and contractions ("don't" = "do not") don't matter.
 */

const CONTRACTIONS: ReadonlyArray<[RegExp, string]> = [
  [/\bwon't\b/g, 'will not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
  [/\bshan't\b/g, 'shall not'],
  [/n't\b/g, ' not'],
  [/'m\b/g, ' am'],
  [/'re\b/g, ' are'],
  [/'ve\b/g, ' have'],
  [/'ll\b/g, ' will'],
  [/'d\b/g, ' would'],
]

export function normalizeGrammar(text: string): string {
  let s = text
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,!?;:"“”()…—–]/g, ' ')
  for (const [pattern, replacement] of CONTRACTIONS) s = s.replace(pattern, replacement)
  return s.replace(/\s+/g, ' ').trim()
}

/** "'s" can mean "is" or "has" — try both readings. */
function variants(text: string): string[] {
  const base = normalizeGrammar(text)
  if (!base.includes("'s")) return [base]
  return [base, base.replace(/'s\b/g, ' is'), base.replace(/'s\b/g, ' has')].map((v) =>
    v.replace(/\s+/g, ' ').trim(),
  )
}

export function matchesAny(given: string, accepted: readonly string[]): boolean {
  const givenForms = new Set(variants(given))
  return accepted.some((answer) => variants(answer).some((form) => givenForms.has(form)))
}

export interface CheckResult {
  correct: boolean
  /** The model answer to show (first accepted answer or the right option). */
  expected: string
}

export function checkExercise(exercise: Exercise, response: ExerciseResponse): CheckResult {
  switch (exercise.type) {
    case 'choice':
      return {
        correct: response === exercise.answer,
        expected: exercise.options[exercise.answer] ?? '',
      }
    case 'gap':
    case 'transform':
    case 'order':
      return {
        correct: typeof response === 'string' && matchesAny(response, exercise.answers),
        expected: exercise.answers[0] ?? '',
      }
  }
}

export interface AttemptResult {
  correct: number
  total: number
  /** Ids of exercises answered wrongly. */
  mistakes: string[]
}

export const scorePercent = ({ correct, total }: AttemptResult) =>
  total === 0 ? 0 : Math.round((correct / total) * 100)

/**
 * Deterministic shuffle (same seed → same order), so word-order exercises don't reshuffle
 * on every render but differ between exercises.
 */
export const seededShuffle = <T>(items: readonly T[], seed: string): T[] =>
  shuffleWith(items, createRng(seed))

/** The tiles of a word-order exercise, in their (stable) shuffled order. */
export const orderTiles = (exercise: OrderExercise) => seededShuffle(exercise.tokens, exercise.id)

/** The learner's sentence: picked tile indices → words. */
export function orderedSentence(exercise: OrderExercise, picked: readonly number[]): string {
  const tiles = orderTiles(exercise)
  return picked.map((i) => tiles[i]).join(' ')
}

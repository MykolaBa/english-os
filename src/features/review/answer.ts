/** Answer checking for the typing mode. Pure functions — see answer.test.ts. */

/** Lowercase, straight apostrophes, no punctuation or extra spaces. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[.,!?;:"“”()…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Classic edit distance (insert / delete / substitute = 1). */
export function levenshtein(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (row[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = row
  }
  return prev[b.length] ?? 0
}

export type AnswerVerdict = 'correct' | 'typo' | 'wrong'

/**
 * "typo" = close enough to count as known (one slip for short words, two for long ones),
 * so a missing letter doesn't send a word back to the start.
 */
export function checkAnswer(input: string, expected: string): AnswerVerdict {
  const given = normalizeAnswer(input)
  const target = normalizeAnswer(expected)
  if (!given) return 'wrong'
  if (given === target) return 'correct'
  // Short words: one changed letter usually makes another word (lend → send), so be exact.
  const allowed = target.length <= 4 ? 0 : target.length >= 8 ? 2 : 1
  return levenshtein(given, target) <= allowed ? 'typo' : 'wrong'
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Hides the word inside its example sentence: "I booked a hotel" → "I ___ a hotel".
 * Returns null when the exact form isn't in the sentence (e.g. "find out" vs "found out").
 */
export function maskTerm(sentence: string, term: string): string | null {
  const pattern = new RegExp(`\\b${escapeRegExp(term.trim())}\\b`, 'i')
  return pattern.test(sentence) ? sentence.replace(pattern, '_____') : null
}

/**
 * Seeded randomness: the same seed always gives the same sequence. Quizzes store only
 * their seed, so "repeat this quiz" regenerates exactly the same questions.
 */
export function createRng(seed: string): () => number {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

export function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const list = [...items]
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[list[i], list[j]] = [list[j]!, list[i]!]
  }
  return list
}

export const newSeed = () => Math.random().toString(36).slice(2, 10)

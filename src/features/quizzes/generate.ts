import type { GrammarLesson } from '@/content/grammar'
import {
  VOCAB_KINDS,
  type LessonProgress,
  type QuizConfig,
  type VocabKind,
  type Word,
} from '@/lib/db/types'
import { createRng, newSeed, shuffleWith } from '@/lib/exercises/random'
import type { Exercise } from '@/lib/exercises/types'
import { maskTerm } from '@/features/review/answer'
import { MISTAKES_COLLECTION_ID } from '@/features/review/reviewRepo'

/**
 * Quiz generation. Pure: the same config (including its seed) and data always produce the
 * same questions, so a quiz can be repeated exactly and history stores only the config.
 */

export { QUIZ_SOURCES, VOCAB_KINDS } from '@/lib/db/types'
export type { QuizConfig, QuizSource, VocabKind } from '@/lib/db/types'

export const QUIZ_SIZES = [10, 20, 30] as const
export const PRESET_SIZE = 10

/** A one-tap quiz of the given kind, with fresh questions each time. */
export const presetConfig = (source: QuizConfig['source']): QuizConfig => ({
  source,
  count: PRESET_SIZE,
  collectionId: null,
  lessonIds: [],
  vocabKinds: [],
  seed: newSeed(),
})

export interface QuizData {
  words: Word[]
  lessons: readonly GrammarLesson[]
  progress: Map<string, LessonProgress>
}

/** Vocabulary exercise ids carry the word id, so mistakes can be traced back to words. */
const VOCAB_PREFIX = 'quiz:'
export const vocabExerciseId = (wordId: string, kind: VocabKind) =>
  `${VOCAB_PREFIX}${kind}:${wordId}`
export function wordIdOf(exerciseId: string): string | null {
  if (!exerciseId.startsWith(VOCAB_PREFIX)) return null
  const rest = exerciseId.slice(VOCAB_PREFIX.length)
  return rest.slice(rest.indexOf(':') + 1) || null
}

const isLearned = (w: Word) => w.srs.status !== 'new'

/** Three wrong options, preferring the same part of speech so the choice isn't obvious. */
function distractors(
  word: Word,
  pool: Word[],
  pick: (w: Word) => string,
  random: () => number,
): string[] {
  const right = pick(word)
  const others = pool.filter((w) => w.id !== word.id && pick(w) !== right)
  const samePos = shuffleWith(
    others.filter((w) => w.partOfSpeech && w.partOfSpeech === word.partOfSpeech),
    random,
  )
  const rest = shuffleWith(others, random)
  const unique = [...new Set([...samePos, ...rest].map(pick))]
  return unique.slice(0, 3)
}

function vocabExercise(
  word: Word,
  kind: VocabKind,
  pool: Word[],
  random: () => number,
): Exercise | null {
  const id = vocabExerciseId(word.id, kind)
  const explanation = `${word.term} — ${word.translation}`
  switch (kind) {
    case 'meaning':
    case 'word': {
      const pick = kind === 'meaning' ? (w: Word) => w.translation : (w: Word) => w.term
      const wrong = distractors(word, pool, pick, random)
      if (wrong.length < 3) return null
      const options = shuffleWith([pick(word), ...wrong], random)
      return {
        id,
        type: 'choice',
        prompt: kind === 'meaning' ? word.term : word.translation,
        promptLang: kind === 'meaning' ? 'en' : 'uk',
        options,
        optionsLang: kind === 'meaning' ? 'uk' : 'en',
        answer: options.indexOf(pick(word)),
        explanation,
      }
    }
    case 'typing':
      return {
        id,
        type: 'transform',
        instruction: 'Переклади англійською.',
        prompt: word.translation,
        promptLang: 'uk',
        answers: [word.term],
        explanation,
      }
    case 'context': {
      const masked = word.example ? maskTerm(word.example, word.term) : null
      return masked ? { id, type: 'gap', prompt: masked, answers: [word.term], explanation } : null
    }
  }
}

function vocabQuestions(
  config: QuizConfig,
  data: QuizData,
  count: number,
  random: () => number,
): Exercise[] {
  const inScope = data.words.filter((w) => {
    if (config.source === 'mistakes') return w.collectionIds.includes(MISTAKES_COLLECTION_ID)
    return !config.collectionId || w.collectionIds.includes(config.collectionId)
  })
  // Learned words first: quizzing words you've never seen isn't fair.
  const ordered = [
    ...shuffleWith(inScope.filter(isLearned), random),
    ...shuffleWith(
      inScope.filter((w) => !isLearned(w)),
      random,
    ),
  ]
  const kinds = config.vocabKinds.length > 0 ? config.vocabKinds : [...VOCAB_KINDS]
  const result: Exercise[] = []
  for (const word of ordered) {
    if (result.length >= count) break
    // Try the kinds in a random order; some don't fit every word (no example, too few options).
    for (const kind of shuffleWith(kinds, random)) {
      const exercise = vocabExercise(word, kind, data.words, random)
      if (exercise) {
        result.push(exercise)
        break
      }
    }
  }
  return result
}

function grammarQuestions(
  config: QuizData & { config: QuizConfig },
  count: number,
  random: () => number,
): Exercise[] {
  const { config: c, lessons, progress } = config
  const pool =
    c.source === 'mistakes'
      ? lessons.flatMap((l) => {
          const wrong = new Set(progress.get(l.id)?.lastMistakes ?? [])
          return l.exercises.filter((e) => wrong.has(e.id))
        })
      : lessons
          .filter((l) => c.lessonIds.length === 0 || c.lessonIds.includes(l.id))
          .flatMap((l) => l.exercises)
  return shuffleWith(pool, random).slice(0, count)
}

export function buildQuiz(config: QuizConfig, data: QuizData): Exercise[] {
  const random = createRng(config.seed)
  switch (config.source) {
    case 'vocabulary':
      return vocabQuestions(config, data, config.count, random)
    case 'grammar':
      return grammarQuestions({ ...data, config }, config.count, random)
    case 'mixed':
    case 'mistakes': {
      // Half and half; if one side runs short, the other fills the gap.
      const grammar = grammarQuestions({ ...data, config }, Math.ceil(config.count / 2), random)
      const vocab = vocabQuestions(config, data, config.count - grammar.length, random)
      const more = grammarQuestions({ ...data, config }, config.count, random)
        .filter((e) => !grammar.includes(e))
        .slice(0, Math.max(0, config.count - grammar.length - vocab.length))
      return shuffleWith([...grammar, ...vocab, ...more], random)
    }
  }
}

/**
 * Rebuilds a finished quiz from its exercise ids (for "repeat"). Questions whose word or
 * lesson no longer exists are skipped. Options are reshuffled with the same seed.
 */
export function rebuildQuiz(
  exerciseIds: readonly string[],
  seed: string,
  data: QuizData,
): Exercise[] {
  const random = createRng(seed)
  const grammar = new Map(data.lessons.flatMap((l) => l.exercises.map((e) => [e.id, e] as const)))
  const words = new Map(data.words.map((w) => [w.id, w]))
  return exerciseIds.flatMap((id) => {
    const wordId = wordIdOf(id)
    if (!wordId) return grammar.get(id) ?? []
    const kind = VOCAB_KINDS.find((k) => id === vocabExerciseId(wordId, k))
    const word = words.get(wordId)
    return (word && kind && vocabExercise(word, kind, data.words, random)) || []
  })
}

import { describe, expect, it } from 'vitest'
import { GRAMMAR_LESSONS } from '@/content/grammar'
import { buildStarterData, seedCollectionId } from '@/features/vocabulary/seed'
import { checkExercise } from '@/lib/exercises/check'
import type { Word } from '@/lib/db/types'
import { buildQuiz, rebuildQuiz, wordIdOf, type QuizConfig } from './generate'

const words: Word[] = buildStarterData(0).words.map((w, i) =>
  i < 30 ? { ...w, srs: { ...w.srs, status: 'reviewing' } } : w,
)
const data = { words, lessons: GRAMMAR_LESSONS, progress: new Map() }
const base: QuizConfig = {
  source: 'mixed',
  count: 10,
  collectionId: null,
  lessonIds: [],
  vocabKinds: [],
  seed: 'abc',
}

describe('buildQuiz', () => {
  it('is deterministic for a seed and different for another', () => {
    const ids = (seed: string) => buildQuiz({ ...base, seed }, data).map((e) => e.id)
    expect(ids('abc')).toEqual(ids('abc'))
    expect(ids('abc')).not.toEqual(ids('xyz'))
  })

  it('mixes grammar and vocabulary and respects the count', () => {
    const quiz = buildQuiz(base, data)
    expect(quiz).toHaveLength(10)
    expect(quiz.some((e) => wordIdOf(e.id))).toBe(true)
    expect(quiz.some((e) => !wordIdOf(e.id))).toBe(true)
    expect(new Set(quiz.map((e) => e.id)).size).toBe(10)
  })

  it('builds valid vocabulary questions whose right answer checks as correct', () => {
    const quiz = buildQuiz({ ...base, source: 'vocabulary', count: 30 }, data)
    expect(quiz).toHaveLength(30)
    for (const ex of quiz) {
      const word = words.find((w) => w.id === wordIdOf(ex.id))!
      if (ex.type === 'choice') {
        expect(new Set(ex.options).size, ex.id).toBe(4)
        expect(checkExercise(ex, ex.answer).correct).toBe(true)
      } else {
        expect(checkExercise(ex, word.term).correct, ex.id).toBe(true)
      }
    }
    // Learned words come first.
    expect(
      quiz
        .slice(0, 10)
        .every((e) => words.find((w) => w.id === wordIdOf(e.id))!.srs.status !== 'new'),
    ).toBe(true)
  })

  it('limits vocabulary to a collection and kinds, grammar to lessons', () => {
    const it = seedCollectionId('it')
    const vocab = buildQuiz(
      { ...base, source: 'vocabulary', collectionId: it, vocabKinds: ['typing'] },
      data,
    )
    expect(vocab.every((e) => e.type === 'transform')).toBe(true)
    expect(
      vocab.every((e) => words.find((w) => w.id === wordIdOf(e.id))!.collectionIds.includes(it)),
    ).toBe(true)

    const grammar = buildQuiz({ ...base, source: 'grammar', lessonIds: ['past-simple'] }, data)
    expect(grammar).toHaveLength(8)
    expect(grammar.every((e) => e.id.startsWith('ps-'))).toBe(true)
  })

  it('builds a mistakes quiz from My Mistakes and last lesson mistakes', () => {
    const mistakeWords = words.map((w, i) =>
      i < 2 ? { ...w, collectionIds: [...w.collectionIds, seedCollectionId('mistakes')] } : w,
    )
    const progress = new Map([
      [
        'past-simple',
        {
          lessonId: 'past-simple',
          status: 'in_progress' as const,
          bookmarked: false,
          attempts: 1,
          lastMistakes: ['ps-2'],
          updatedAt: 0,
        },
      ],
    ])
    const quiz = buildQuiz(
      { ...base, source: 'mistakes' },
      { words: mistakeWords, lessons: GRAMMAR_LESSONS, progress },
    )
    expect(quiz.map((e) => e.id).toSorted()).toEqual(
      ['ps-2', ...quiz.filter((e) => wordIdOf(e.id)).map((e) => e.id)].toSorted(),
    )
    expect(quiz).toHaveLength(3)
  })
})

describe('rebuildQuiz', () => {
  it('gives the same questions back even after the learned words changed', () => {
    const original = buildQuiz({ ...base, source: 'vocabulary' }, data)
    const changed = {
      ...data,
      words: data.words.map((w) => ({ ...w, srs: { ...w.srs, status: 'mastered' as const } })),
    }
    const again = rebuildQuiz(
      original.map((e) => e.id),
      base.seed,
      changed,
    )
    expect(again.map((e) => e.id)).toEqual(original.map((e) => e.id))
  })

  it('skips questions whose word or lesson is gone', () => {
    expect(
      rebuildQuiz(['quiz:typing:missing', 'nope', 'ps-1'], 's', data).map((e) => e.id),
    ).toEqual(['ps-1'])
  })
})

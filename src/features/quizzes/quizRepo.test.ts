import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import type { QuizConfig } from '@/lib/db/types'
import { MISTAKES_COLLECTION_ID } from '@/features/review/reviewRepo'
import { seedStarterVocabulary } from '@/features/vocabulary/seed'
import { vocabExerciseId } from './generate'
import { getRecentQuizzes, saveQuizResult } from './quizRepo'

const config = (source: QuizConfig['source']): QuizConfig => ({
  source,
  count: 3,
  collectionId: null,
  lessonIds: [],
  vocabKinds: [],
  seed: 's',
})
const deploy = vocabExerciseId('seed:word:deploy', 'typing')
const merge = vocabExerciseId('seed:word:merge', 'meaning')
const inMistakes = async (id: string) =>
  (await db.words.get(id))?.collectionIds.includes(MISTAKES_COLLECTION_ID)

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  await seedStarterVocabulary()
})

describe('saveQuizResult', () => {
  it('stores history with the questions, gives XP and records missed words and grammar', async () => {
    await saveQuizResult(
      config('mixed'),
      [deploy, merge, 'ps-1'],
      { correct: 1, total: 3, mistakes: [deploy, 'ps-1'] },
      40,
    )

    const [saved] = await getRecentQuizzes()
    expect(saved).toMatchObject({
      correct: 1,
      total: 3,
      durationSec: 40,
      exerciseIds: [deploy, merge, 'ps-1'],
    })
    expect(await inMistakes('seed:word:deploy')).toBe(true)
    expect(await inMistakes('seed:word:merge')).toBe(false)
    expect((await db.lessonProgress.get('past-simple'))?.lastMistakes).toEqual(['ps-1'])
    expect((await db.activity.toArray()).map((e) => [e.type, e.xp, e.subject])).toEqual([
      ['quiz', 1, '1/3'],
    ])
  })

  it('clears fixed mistakes only in a "My mistakes" quiz', async () => {
    await saveQuizResult(
      config('mixed'),
      [deploy, 'ps-1'],
      { correct: 0, total: 2, mistakes: [deploy, 'ps-1'] },
      1,
    )
    // A correct answer in an ordinary quiz keeps the mistake…
    await saveQuizResult(config('mixed'), [deploy], { correct: 1, total: 1, mistakes: [] }, 1)
    expect(await inMistakes('seed:word:deploy')).toBe(true)
    // …a correct answer in the mistakes quiz clears it, for words and grammar.
    await saveQuizResult(
      config('mistakes'),
      [deploy, 'ps-1'],
      { correct: 2, total: 2, mistakes: [] },
      1,
    )
    expect(await inMistakes('seed:word:deploy')).toBe(false)
    expect((await db.lessonProgress.get('past-simple'))?.lastMistakes).toEqual([])
  })
})

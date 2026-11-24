import { logActivity } from '@/lib/activity/activityRepo'
import { db } from '@/lib/db/db'
import type { QuizConfig, QuizResult } from '@/lib/db/types'
import type { AttemptResult } from '@/lib/exercises/check'
import { MISTAKES_COLLECTION_ID } from '@/features/review/reviewRepo'
import { GRAMMAR_LESSONS } from '@/content/grammar'
import { wordIdOf } from './generate'

/**
 * Saves a finished quiz: history row (with the exact questions), XP (one per correct answer)
 * and keeps mistakes in sync — missed words go to "My Mistakes", missed grammar questions to
 * their lesson's mistakes. In a "My mistakes" quiz, correct answers clear them again.
 */
export async function saveQuizResult(
  config: QuizConfig,
  exerciseIds: readonly string[],
  result: AttemptResult,
  durationSec: number,
  now = Date.now(),
): Promise<void> {
  const missed = new Set(result.mistakes)
  const correct = exerciseIds.filter((id) => !missed.has(id))
  const clearing = config.source === 'mistakes'
  const wordIds = (ids: readonly string[]) => [...new Set(ids.flatMap((id) => wordIdOf(id) ?? []))]

  await db.transaction(
    'rw',
    [db.quizResults, db.words, db.collections, db.lessonProgress, db.activity],
    async () => {
      await db.quizResults.add({
        at: now,
        config,
        durationSec,
        exerciseIds: [...exerciseIds],
        ...result,
      })

      if (await db.collections.get(MISTAKES_COLLECTION_ID)) {
        await db.words
          .where('id')
          .anyOf(wordIds(result.mistakes))
          .modify((w) => {
            if (!w.collectionIds.includes(MISTAKES_COLLECTION_ID))
              w.collectionIds.push(MISTAKES_COLLECTION_ID)
          })
        if (clearing) {
          await db.words
            .where('id')
            .anyOf(wordIds(correct))
            .modify((w) => {
              w.collectionIds = w.collectionIds.filter((c) => c !== MISTAKES_COLLECTION_ID)
            })
        }
      }

      // Grammar: merge missed questions into each lesson's mistakes (and clear fixed ones).
      for (const lesson of GRAMMAR_LESSONS) {
        const ids = new Set(lesson.exercises.map((e) => e.id))
        const add = result.mistakes.filter((id) => ids.has(id))
        const remove = clearing ? correct.filter((id) => ids.has(id)) : []
        if (add.length === 0 && remove.length === 0) continue
        const current = await db.lessonProgress.get(lesson.id)
        const lastMistakes = [...new Set([...(current?.lastMistakes ?? []), ...add])].filter(
          (id) => !remove.includes(id),
        )
        await db.lessonProgress.put({
          lessonId: lesson.id,
          status: current?.status ?? 'in_progress',
          bookmarked: current?.bookmarked ?? false,
          attempts: current?.attempts ?? 0,
          bestScore: current?.bestScore,
          lastScore: current?.lastScore,
          completedAt: current?.completedAt,
          lastMistakes,
          updatedAt: now,
        })
      }

      // Subject is language-neutral ("8/10"); the feed builds the sentence.
      await logActivity({
        type: 'quiz',
        xp: result.correct,
        subject: `${result.correct}/${result.total}`,
        at: now,
      })
    },
  )
}

export function getRecentQuizzes(limit = 8): Promise<QuizResult[]> {
  return db.quizResults.orderBy('at').reverse().limit(limit).toArray()
}

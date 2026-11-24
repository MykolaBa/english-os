import { useLiveQuery } from 'dexie-react-hooks'
import { GRAMMAR_LESSONS } from '@/content/grammar'
import { db } from '@/lib/db/db'
import type { QuizResult } from '@/lib/db/types'
import type { QuizData } from './generate'
import { getRecentQuizzes } from './quizRepo'

export interface QuizPageData extends QuizData {
  recent: QuizResult[]
}

/** Words, lesson progress and quiz history, live. `undefined` while loading. */
export function useQuizData(): QuizPageData | undefined {
  return useLiveQuery(async () => {
    const [words, progress, recent] = await Promise.all([
      db.words.toArray(),
      db.lessonProgress.toArray(),
      getRecentQuizzes(),
    ])
    return {
      words,
      lessons: GRAMMAR_LESSONS,
      progress: new Map(progress.map((p) => [p.lessonId, p])),
      recent,
    }
  }, [])
}

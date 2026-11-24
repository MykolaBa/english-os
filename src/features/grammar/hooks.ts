import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import type { LessonProgress } from '@/lib/db/types'

/** Progress for all lessons, keyed by lesson id. `undefined` while loading. */
export function useAllProgress(): Map<string, LessonProgress> | undefined {
  return useLiveQuery(
    async () => new Map((await db.lessonProgress.toArray()).map((p) => [p.lessonId, p])),
    [],
  )
}

export function useProgress(lessonId: string | undefined): LessonProgress | null | undefined {
  return useLiveQuery(
    async () => (lessonId ? ((await db.lessonProgress.get(lessonId)) ?? null) : null),
    [lessonId],
  )
}

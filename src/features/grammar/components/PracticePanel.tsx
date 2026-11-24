import { PenLine } from 'lucide-react'
import type { GrammarLesson } from '@/content/grammar'
import { useT } from '@/i18n'
import type { LessonProgress } from '@/lib/db/types'
import { PracticeSection } from '@/features/exercises/PracticeSection'
import { PASS_SCORE, recordAttempt } from '../progressRepo'
import styles from '../Grammar.module.scss'

export function PracticePanel({
  lesson,
  progress,
}: {
  lesson: GrammarLesson
  progress: LessonProgress | null
}) {
  const l = useT().grammar.lesson
  return (
    <PracticeSection
      className={styles.practice}
      title={l.practice}
      intro={
        <>
          <p>{l.practiceText(lesson.exercises.length, PASS_SCORE)}</p>
          {progress?.lastScore !== undefined && progress.bestScore !== undefined && (
            <p className={styles.lastResult}>
              {l.lastResult(progress.lastScore, progress.bestScore)}
            </p>
          )}
        </>
      }
      startLabel={l.start}
      startIcon={<PenLine />}
      build={() => lesson.exercises}
      passScore={PASS_SCORE}
      onComplete={(result) => recordAttempt(lesson.id, lesson.title, result)}
    />
  )
}

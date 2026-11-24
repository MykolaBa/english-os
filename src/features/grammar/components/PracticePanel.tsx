import { useEffect, useRef, useState } from 'react'
import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui'
import type { GrammarLesson } from '@/content/grammar'
import { useT } from '@/i18n'
import type { LessonProgress } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { ExerciseRunner } from '@/features/exercises/ExerciseRunner'
import { PASS_SCORE, recordAttempt } from '../progressRepo'
import styles from '../Grammar.module.scss'

export function PracticePanel({
  lesson,
  progress,
}: {
  lesson: GrammarLesson
  progress: LessonProgress | null
}) {
  const t = useT()
  const l = t.grammar.lesson
  const [running, setRunning] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Starting the exercises brings the whole panel into view (on phones it sits far below).
  useEffect(() => {
    if (running) sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [running])

  return (
    <section ref={sectionRef} className={styles.practice} aria-labelledby="practice-title">
      <h2 id="practice-title" className={styles.sectionTitle}>
        {l.practice}
      </h2>
      {running ? (
        <ExerciseRunner
          exercises={lesson.exercises}
          passScore={PASS_SCORE}
          onComplete={(result) =>
            void recordAttempt(lesson.id, lesson.title, result).catch((err) =>
              toast.error(t.errors.title, String(err)),
            )
          }
          onClose={() => setRunning(false)}
        />
      ) : (
        <>
          <p className={styles.paragraph}>{l.practiceText(lesson.exercises.length, PASS_SCORE)}</p>
          {progress?.lastScore !== undefined && progress.bestScore !== undefined && (
            <p className={styles.lastResult}>
              {l.lastResult(progress.lastScore, progress.bestScore)}
            </p>
          )}
          <Button variant="primary" size="lg" icon={<PenLine />} onClick={() => setRunning(true)}>
            {l.start}
          </Button>
        </>
      )}
    </section>
  )
}

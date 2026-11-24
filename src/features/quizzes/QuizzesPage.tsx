import { useState } from 'react'
import { X } from 'lucide-react'
import { Button, PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import type { QuizConfig } from '@/lib/db/types'
import type { Exercise } from '@/lib/exercises/types'
import { toast } from '@/stores/toastStore'
import { ExerciseRunner } from '@/features/exercises/ExerciseRunner'
import { CustomQuiz } from './components/CustomQuiz'
import { QuickQuizzes } from './components/QuickQuizzes'
import { QuizHistory } from './components/QuizHistory'
import { buildQuiz, rebuildQuiz } from './generate'
import { useQuizData } from './hooks'
import { saveQuizResult } from './quizRepo'
import styles from './Quizzes.module.scss'

interface Running {
  config: QuizConfig
  exercises: Exercise[]
  startedAt: number
}

export default function QuizzesPage() {
  const t = useT()
  const q = t.quizzes
  const data = useQuizData()
  const [running, setRunning] = useState<Running | null>(null)

  const start = (config: QuizConfig, exerciseIds?: string[]) => {
    if (!data) return
    const exercises = exerciseIds
      ? rebuildQuiz(exerciseIds, config.seed, data)
      : buildQuiz(config, data)
    if (exercises.length === 0) return void toast.info(q.notEnough)
    setRunning({ config, exercises, startedAt: Date.now() })
  }

  if (running) {
    return (
      <section className={styles.session} aria-label={q.title}>
        <header className={styles.sessionHeader}>
          <h1>{q.presets[running.config.source].title}</h1>
          <Button variant="ghost" size="sm" icon={<X />} onClick={() => setRunning(null)}>
            {q.end}
          </Button>
        </header>
        <ExerciseRunner
          exercises={running.exercises}
          onComplete={(result) =>
            void saveQuizResult(
              running.config,
              running.exercises.map((e) => e.id),
              result,
              Math.round((Date.now() - running.startedAt) / 1000),
            ).catch((err) => toast.error(t.errors.title, String(err)))
          }
          onClose={() => setRunning(null)}
        />
      </section>
    )
  }

  return (
    <>
      <PageHeader title={q.title} description={q.subtitle} />
      {!data ? (
        <Skeleton height={420} />
      ) : (
        <div className={styles.layout}>
          <div className={styles.column}>
            <QuickQuizzes onStart={start} />
            <QuizHistory results={data.recent} onRepeat={(r) => start(r.config, r.exerciseIds)} />
          </div>
          <CustomQuiz data={data} onStart={start} />
        </div>
      )}
    </>
  )
}

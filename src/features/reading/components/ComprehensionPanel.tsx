import { useEffect, useRef, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { Button } from '@/components/ui'
import type { ReadingText } from '@/content/reading'
import { useT } from '@/i18n'
import type { ReadingProgress } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { ExerciseRunner } from '@/features/exercises/ExerciseRunner'
import { recordReading } from '../readingRepo'
import styles from '../Reading.module.scss'

/** Comprehension questions on the shared exercise engine; finishing them marks the text read. */
export function ComprehensionPanel({
  text,
  progress,
}: {
  text: ReadingText
  progress: ReadingProgress | null
}) {
  const t = useT()
  const r = t.reading
  const [running, setRunning] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (running) ref.current?.scrollIntoView({ block: 'start' })
  }, [running])

  return (
    <section ref={ref} aria-labelledby="check-title" className={styles.check}>
      <h2 id="check-title" className={styles.sectionTitle}>
        {r.check}
      </h2>
      {running ? (
        <ExerciseRunner
          exercises={text.questions}
          onComplete={(result) =>
            void recordReading(text.id, text.title, result).catch((err) =>
              toast.error(t.errors.title, String(err)),
            )
          }
          onClose={() => setRunning(false)}
        />
      ) : (
        <>
          <p className={styles.checkText}>{r.checkText(text.questions.length)}</p>
          {progress?.lastScore !== undefined && progress.bestScore !== undefined && (
            <p className={styles.checkText}>
              {r.lastResult(progress.lastScore, progress.bestScore)}
            </p>
          )}
          <Button variant="primary" icon={<ListChecks />} onClick={() => setRunning(true)}>
            {r.checkStart}
          </Button>
        </>
      )}
    </section>
  )
}

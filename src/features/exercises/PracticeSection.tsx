import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { AttemptResult } from '@/lib/exercises/check'
import type { Exercise } from '@/lib/exercises/types'
import { toast } from '@/stores/toastStore'
import { ExerciseRunner } from './ExerciseRunner'
import styles from './Exercises.module.scss'

interface PracticeSectionProps {
  title: string
  /** What's about to happen, and the last result if there is one. */
  intro: ReactNode
  startLabel: string
  startIcon: ReactNode
  /** Builds the round when the learner starts (a fresh seed, the lesson's exercises…). */
  build: () => readonly Exercise[]
  passScore?: number
  /** Saves the result (progress, XP). Errors are reported with a toast. */
  onComplete: (result: AttemptResult) => Promise<unknown>
  /** A round started or ended — e.g. to hide answers shown elsewhere on the page. */
  onRunningChange?: (running: boolean) => void
  className?: string
}

/**
 * The "start practising" block shared by grammar lessons, reading texts and IT English:
 * an intro and a start button, then the exercise runner in place. Starting scrolls the
 * block into view — on a phone it usually sits far below.
 */
export function PracticeSection({
  title,
  intro,
  startLabel,
  startIcon,
  build,
  passScore,
  onComplete,
  onRunningChange,
  className,
}: PracticeSectionProps) {
  const t = useT()
  const titleId = useId()
  const ref = useRef<HTMLElement>(null)
  const [round, setRound] = useState<readonly Exercise[] | null>(null)

  useEffect(() => {
    if (round) ref.current?.scrollIntoView({ block: 'start' })
  }, [round])

  const setRunning = (next: readonly Exercise[] | null) => {
    setRound(next)
    onRunningChange?.(next !== null)
  }

  return (
    <section ref={ref} className={cx(styles.section, className)} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.sectionTitle}>
        {title}
      </h2>
      {round ? (
        <ExerciseRunner
          exercises={round}
          passScore={passScore}
          onComplete={(result) =>
            void onComplete(result).catch((err: unknown) =>
              toast.error(t.errors.title, String(err)),
            )
          }
          onClose={() => setRunning(null)}
        />
      ) : (
        <>
          <div className={styles.sectionIntro}>{intro}</div>
          <Button variant="primary" icon={startIcon} onClick={() => setRunning(build())}>
            {startLabel}
          </Button>
        </>
      )}
    </section>
  )
}

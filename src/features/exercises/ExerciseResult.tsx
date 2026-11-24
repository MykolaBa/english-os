import { CircleCheck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import { useT } from '@/i18n'
import { scorePercent, type AttemptResult } from '@/lib/exercises/check'
import type { Exercise } from '@/lib/exercises/types'
import styles from './Exercises.module.scss'

interface ExerciseResultProps {
  result: AttemptResult
  exercises: readonly Exercise[]
  passScore: number
  onRetry: () => void
  onClose: () => void
}

const promptOf = (e: Exercise) => (e.type === 'order' ? e.answers[0] : e.prompt)

export function ExerciseResult({
  result,
  exercises,
  passScore,
  onRetry,
  onClose,
}: ExerciseResultProps) {
  const t = useT().exercises
  const pct = scorePercent(result)
  const missed = exercises.filter((e) => result.mistakes.includes(e.id))

  return (
    <section className={styles.result}>
      <CircleCheck className={styles.resultIcon} aria-hidden />
      <h3 className={styles.resultTitle}>{t.resultTitle(pct)}</h3>
      <p className={styles.resultText}>
        {t.resultText(result.correct, result.total)}{' '}
        {pct >= passScore ? t.passed : t.notPassed(passScore)}
      </p>
      {missed.length > 0 && (
        <div className={styles.missed}>
          <h4>{t.mistakesTitle}</h4>
          <ul>
            {missed.map((e) => (
              <li key={e.id}>
                <p lang="en">{promptOf(e)}</p>
                <p className={styles.explanation}>{e.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.actions}>
        <Button variant="primary" icon={<RotateCcw />} onClick={onRetry}>
          {t.tryAgain}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {t.close}
        </Button>
      </div>
    </section>
  )
}

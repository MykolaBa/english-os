import { Check, X } from 'lucide-react'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { CheckResult } from '@/lib/exercises/check'
import type { Exercise } from '@/lib/exercises/types'
import styles from './Exercises.module.scss'

/** Right or wrong, the expected answer, and why — shown after checking. */
export function ExerciseFeedback({
  exercise,
  checked,
}: {
  exercise: Exercise
  checked: CheckResult
}) {
  const t = useT().exercises
  // A choice can have Ukrainian options (generated vocabulary quizzes).
  const answerLang = exercise.type === 'choice' ? (exercise.optionsLang ?? 'en') : 'en'
  return (
    <div
      className={cx(styles.feedback, checked.correct ? styles.feedbackRight : styles.feedbackWrong)}
      role="status"
    >
      <p className={styles.verdict}>
        {checked.correct ? <Check aria-hidden /> : <X aria-hidden />}
        {checked.correct ? t.correct : t.incorrect}
      </p>
      {!checked.correct && (
        <p>
          {t.answerIs}: <strong lang={answerLang}>{checked.expected}</strong>
        </p>
      )}
      <p className={styles.explanation}>{exercise.explanation}</p>
    </div>
  )
}

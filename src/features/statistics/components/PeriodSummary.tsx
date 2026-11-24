import { useT } from '@/i18n'
import type { PeriodSummary as Summary } from '../stats'
import styles from '../Statistics.module.scss'

interface Figure {
  label: string
  value: string
  hint?: string
}

/** The period in six numbers: one quiet surface with dividers, not a row of cards. */
export function PeriodSummary({ summary, days }: { summary: Summary; days: number }) {
  const { locale, statistics } = useT()
  const s = statistics.summary
  const n = (value: number) => value.toLocaleString(locale)
  const figures: Figure[] = [
    { label: s.xp, value: n(summary.xp) },
    { label: s.activeDays, value: n(summary.activeDays), hint: s.activeDaysHint(days) },
    {
      label: s.accuracy,
      value: summary.accuracy === null ? statistics.noValue : `${summary.accuracy}%`,
      hint: s.accuracyHint(summary.answers),
    },
    {
      label: s.wordsStarted,
      value: n(summary.wordsStarted),
      hint: s.wordsAddedHint(summary.wordsAdded),
    },
    { label: s.lessons, value: n(summary.lessonsCompleted) },
    { label: s.quizzes, value: n(summary.quizzes), hint: s.quizzesHint(summary.quizAverage) },
  ]

  return (
    <section aria-label={s.label} className={styles.summary}>
      <dl className={styles.figures}>
        {figures.map((f) => (
          <div key={f.label} className={styles.figure}>
            <dt>{f.label}</dt>
            <dd className={styles.figureValue}>{f.value}</dd>
            {f.hint && <dd className={styles.figureHint}>{f.hint}</dd>}
          </div>
        ))}
      </dl>
    </section>
  )
}

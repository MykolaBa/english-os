import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Button, ButtonLink } from '@/components/ui'
import { useT } from '@/i18n'
import { XP_PER_REVIEW } from '../reviewRepo'
import { summarize, type SessionState } from '../session'
import styles from '../Review.module.scss'

interface SessionSummaryProps {
  state: SessionState
  finishedAt: number
  onBack: () => void
}

export function SessionSummary({ state, finishedAt, onBack }: SessionSummaryProps) {
  const t = useT().review.summary
  const summary = summarize(state)
  const pct = Math.round(summary.accuracy * 100)
  const minutes = Math.round((finishedAt - state.startedAt) / 60_000)

  return (
    <section className={styles.summary}>
      <CircleCheck className={styles.summaryIcon} aria-hidden />
      <h2 className={styles.summaryTitle}>{t.title}</h2>
      <p className={styles.summaryText}>{t.text(summary.reviewed, pct)}</p>
      <p className={styles.summaryMeta}>
        <span>{t.xp(summary.reviewed * XP_PER_REVIEW)}</span>
        <span>{t.time(minutes)}</span>
      </p>

      <div className={styles.struggled}>
        {summary.struggled.length === 0 ? (
          <p className={styles.muted}>{t.noMistakes}</p>
        ) : (
          <>
            <h3>{t.struggled}</h3>
            <p className={styles.muted}>{t.struggledHint}</p>
            <ul>
              {summary.struggled.map((id) => {
                const word = state.words[id]
                return word ? (
                  <li key={id}>
                    <Link to={`/vocabulary/${encodeURIComponent(id)}`} lang="en">
                      {word.term}
                    </Link>
                    <span lang="uk">{word.translation}</span>
                  </li>
                ) : null
              })}
            </ul>
          </>
        )}
      </div>

      <div className={styles.summaryActions}>
        <Button variant="primary" size="lg" onClick={onBack}>
          {t.again}
        </Button>
        <ButtonLink to="/" variant="ghost" size="lg">
          {t.dashboard}
        </ButtonLink>
      </div>
    </section>
  )
}

import { History, RotateCcw } from 'lucide-react'
import { Button, Card, CardHeader, EmptyState } from '@/components/ui'
import { useT } from '@/i18n'
import { formatRelative } from '@/lib/date'
import type { QuizResult } from '@/lib/db/types'
import { scorePercent } from '@/lib/exercises/check'
import { cx } from '@/lib/cx'
import styles from '../Quizzes.module.scss'

export function QuizHistory({
  results,
  onRepeat,
}: {
  results: QuizResult[]
  onRepeat: (result: QuizResult) => void
}) {
  const t = useT()
  const q = t.quizzes
  return (
    <Card padding="none">
      <div className={styles.cardPad}>
        <CardHeader icon={<History />} title={q.historyTitle} />
      </div>
      {results.length === 0 ? (
        <EmptyState compact icon={<History />} title={q.historyEmpty} />
      ) : (
        <ul className={styles.rows}>
          {results.map((r) => {
            const pct = scorePercent(r)
            return (
              <li key={r.id} className={styles.row}>
                <span
                  className={cx(styles.score, pct >= 80 ? styles.good : pct < 50 && styles.weak)}
                >
                  {pct}%
                </span>
                <div className={styles.rowText}>
                  <p className={styles.rowTitle}>{q.presets[r.config.source].title}</p>
                  <p className={styles.rowMeta}>
                    {q.historyScore(r.correct, r.total)},{' '}
                    {formatRelative(r.at, t.locale, t.common.justNow)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" icon={<RotateCcw />} onClick={() => onRepeat(r)}>
                  {q.repeat}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

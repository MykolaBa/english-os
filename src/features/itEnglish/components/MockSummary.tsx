import { CircleCheck, PenLine, RotateCcw } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui'
import type { InterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import { formatClock, XP_PER_MOCK_QUESTION } from '../mock'
import styles from '../ItEnglish.module.scss'

interface MockSummaryProps {
  questions: InterviewQuestion[]
  times: number[]
  onAgain: () => void
}

/** What you just answered, with a way to turn each spoken answer into a written one. */
export function MockSummary({ questions, times, onAgain }: MockSummaryProps) {
  const m = useT().itEnglish.mock
  return (
    <section className={styles.panel} aria-labelledby="mock-done">
      <CircleCheck className={styles.doneIcon} aria-hidden />
      <h2 id="mock-done" className={styles.sectionTitle}>
        {m.doneTitle}
      </h2>
      <p className={styles.muted}>
        {m.doneText(times.length, times.length * XP_PER_MOCK_QUESTION)}
      </p>
      <ol className={styles.summaryList}>
        {questions.slice(0, times.length).map((q, i) => (
          <li key={q.id} className={styles.summaryRow}>
            <span className={styles.rowMain}>
              <span className={styles.rowTitle} lang="en">
                {q.question}
              </span>
              <span className={styles.rowText}>{m.timeSpent(formatClock(times[i] ?? 0))}</span>
            </span>
            <ButtonLink
              to={`/it-english/interview/${q.id}`}
              variant="ghost"
              size="sm"
              icon={<PenLine />}
            >
              {m.writeAnswer}
            </ButtonLink>
          </li>
        ))}
      </ol>
      <Button variant="primary" icon={<RotateCcw />} onClick={onAgain}>
        {m.again}
      </Button>
    </section>
  )
}

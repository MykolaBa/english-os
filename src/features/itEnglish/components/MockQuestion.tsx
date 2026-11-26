import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { Button, ProgressBar, SpeakButton } from '@/components/ui'
import type { InterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { speak, stopSpeaking } from '@/lib/speech'
import { ANSWER_SECONDS, formatClock } from '../mock'
import { useCountdown } from '@/lib/useCountdown'
import styles from '../ItEnglish.module.scss'

interface MockQuestionProps {
  question: InterviewQuestion
  position: number
  total: number
  readAloud: boolean
  /** Called with the seconds spent on this question. */
  onNext: (seconds: number) => void
}

/** One question of the mock interview. Mount it with `key` per question: the timer restarts. */
export function MockQuestion({ question, position, total, readAloud, onNext }: MockQuestionProps) {
  const t = useT()
  const m = t.itEnglish.mock
  const { left, elapsed } = useCountdown(ANSWER_SECONDS)
  const [hints, setHints] = useState(false)
  const last = position === total

  // The interviewer asks the question (speech is a side effect, hence the effect).
  useEffect(() => {
    if (readAloud) speak(question.question, 0.95)
    return stopSpeaking
  }, [question, readAloud])

  return (
    <section className={styles.panel} aria-labelledby="mock-question">
      <p className={styles.mockProgress}>{m.progress(position, total)}</p>
      <div className={styles.questionLine}>
        <h2 id="mock-question" className={styles.mockQuestion} lang="en">
          {question.question}
        </h2>
        <SpeakButton text={question.question} size="md" />
      </div>

      <div className={styles.timer}>
        <span className={styles.timerLabel}>{m.timeLeft}</span>
        <span role="timer" className={cx(styles.clock, left === 0 && styles.clockUp)}>
          {formatClock(left)}
        </span>
        <ProgressBar
          value={left / ANSWER_SECONDS}
          label={m.timeLeft}
          tone={left === 0 ? 'warning' : 'brand'}
          size="sm"
          className={styles.timerBar}
        />
      </div>
      <p className={styles.timeUp} aria-live="polite">
        {left === 0 ? m.timeUp : ''}
      </p>

      {hints && (
        <ol className={styles.outline} lang="en">
          {question.outline.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ol>
      )}
      <div className={styles.mockActions}>
        <Button variant="ghost" icon={<Lightbulb />} onClick={() => setHints((h) => !h)}>
          {hints ? m.hideHints : m.showHints}
        </Button>
        <Button variant="primary" onClick={() => onNext(elapsed())}>
          {last ? m.finish : m.next}
        </Button>
      </div>
    </section>
  )
}

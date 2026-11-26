import { ProgressBar } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { useCountdown } from '@/lib/useCountdown'
import { formatDuration } from '../recorder'
import styles from '../Speaking.module.scss'

/** Mounted while recording, so the countdown starts with the take. */
export function RecordingTimer({ seconds }: { seconds: number }) {
  const s = useT().speaking
  const { left } = useCountdown(seconds)
  return (
    <div className={styles.timer}>
      <span className={styles.timerLabel}>{s.timeLeft}</span>
      <span role="timer" className={cx(styles.clock, left === 0 && styles.clockOver)}>
        {formatDuration(left * 1000)}
      </span>
      <ProgressBar
        value={left / seconds}
        label={s.timeLeft}
        tone={left === 0 ? 'warning' : 'brand'}
        size="sm"
        className={styles.timerBar}
      />
      <p className={styles.overTime} aria-live="polite">
        {left === 0 ? s.overTime : ''}
      </p>
    </div>
  )
}

import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { RecorderStatus } from '../useRecorder'
import styles from '../Speaking.module.scss'

interface RecordButtonProps {
  status: RecorderStatus
  /** This button's item is the one being recorded. */
  active: boolean
  level: number
  onStart: () => void
  onStop: () => void
  size?: 'sm' | 'lg'
}

/** Record / Stop with a live loudness meter while recording (shows the mic hears you). */
export function RecordButton({
  status,
  active,
  level,
  onStart,
  onStop,
  size = 'sm',
}: RecordButtonProps) {
  const s = useT().speaking
  const recording = active && status === 'recording'
  const busy = status === 'starting' || (status === 'recording' && !active)
  return (
    <span className={styles.recordWrap}>
      <Button
        variant={recording ? 'primary' : 'secondary'}
        size={size}
        icon={recording ? <Square /> : <Mic />}
        className={cx(recording && styles.recordingButton)}
        disabled={busy || status === 'unsupported'}
        onClick={recording ? onStop : onStart}
      >
        {recording ? s.stop : active && status === 'starting' ? s.starting : s.record}
      </Button>
      {recording && (
        <span
          className={styles.meter}
          role="meter"
          aria-label={s.level}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(level * 100)}
        >
          <span style={{ transform: `scaleX(${level})` }} />
        </span>
      )}
    </span>
  )
}

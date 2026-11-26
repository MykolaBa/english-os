import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { Button, Card, ProgressBar, Segmented } from '@/components/ui'
import { useT } from '@/i18n'
import { RATES, type Rate } from '../useScriptPlayer'
import styles from '../Listening.module.scss'

interface PlayerBarProps {
  total: number
  current: number | null
  playing: boolean
  rate: Rate
  onToggle: () => void
  onPlayFrom: (line: number) => void
  onRate: (rate: Rate) => void
}

const RATE_KEY = { 0.75: 'slow', 0.9: 'normal', 1: 'natural' } as const satisfies Record<
  Rate,
  string
>

/** Play / pause, previous / next line, speed, and where you are in the episode. */
export function PlayerBar({
  total,
  current,
  playing,
  rate,
  onToggle,
  onPlayFrom,
  onRate,
}: PlayerBarProps) {
  const l = useT().listening
  const at = current ?? -1
  return (
    <Card className={styles.player}>
      <div className={styles.controls}>
        <Button
          variant="ghost"
          iconOnly
          icon={<SkipBack />}
          aria-label={l.previous}
          disabled={at <= 0}
          onClick={() => onPlayFrom(at - 1)}
        />
        <Button
          variant="primary"
          size="lg"
          icon={playing ? <Pause /> : <Play />}
          onClick={onToggle}
        >
          {playing ? l.pause : current === null ? l.play : l.resume}
        </Button>
        <Button
          variant="ghost"
          iconOnly
          icon={<SkipForward />}
          aria-label={l.next}
          disabled={at >= total - 1}
          onClick={() => onPlayFrom(at + 1)}
        />
      </div>
      <p className={styles.position} aria-live="polite">
        {current === null ? l.ready(total) : l.position(current + 1, total)}
      </p>
      <ProgressBar
        value={current === null ? 0 : (current + 1) / total}
        label={l.transcript}
        size="sm"
      />
      <Segmented<`${Rate}`>
        label={l.speed}
        value={`${rate}`}
        options={RATES.map((r) => ({ value: `${r}`, label: l.speeds[RATE_KEY[r]] }))}
        onChange={(v) => onRate(v === '0.75' ? 0.75 : v === '1' ? 1 : 0.9)}
      />
      <p className={styles.voiceNote}>{l.voiceNote}</p>
    </Card>
  )
}

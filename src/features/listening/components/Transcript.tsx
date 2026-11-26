import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, Card, CardHeader, Switch } from '@/components/ui'
import type { ListeningEpisode } from '@/content/listening'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import styles from '../Listening.module.scss'

interface TranscriptProps {
  episode: ListeningEpisode
  current: number | null
  /** Hidden at first: listening without reading is the point. */
  defaultOpen: boolean
  onPlayFrom: (line: number) => void
}

/** The script, line by line: the line being spoken is highlighted; tap a line to play from it. */
export function Transcript({ episode, current, defaultOpen, onPlayFrom }: TranscriptProps) {
  const l = useT().listening
  const [open, setOpen] = useState(defaultOpen)
  const [translation, setTranslation] = useState(false)
  return (
    <Card>
      <CardHeader
        title={l.transcript}
        description={open ? undefined : l.transcriptHint}
        action={
          <Button
            size="sm"
            variant="ghost"
            icon={open ? <EyeOff /> : <Eye />}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? l.hideTranscript : l.showTranscript}
          </Button>
        }
      />
      {open && (
        <>
          <Switch label={l.showTranslation} checked={translation} onChange={setTranslation} />
          <ol className={styles.lines}>
            {episode.lines.map((line, i) => {
              const name = episode.speakers[line.speaker] ?? ''
              return (
                <li key={i} className={cx(styles.line, current === i && styles.lineCurrent)}>
                  {/* The whole line plays from here; its own text is the button's name. */}
                  <button
                    type="button"
                    className={styles.lineButton}
                    aria-current={current === i ? 'true' : undefined}
                    onClick={() => onPlayFrom(i)}
                  >
                    <span
                      className={cx(styles.speaker, styles[`speaker-${line.speaker}`])}
                      lang="en"
                    >
                      {name}
                    </span>
                    <span className={styles.lineText}>
                      <span lang="en">{line.en}</span>
                      {translation && (
                        <span className={styles.lineUk} lang="uk">
                          {line.uk}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </Card>
  )
}

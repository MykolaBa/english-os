import { Snail, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui'
import type { ShadowSentence } from '@/content/speaking'
import { useT } from '@/i18n'
import type { Recording, SelfRating } from '@/lib/db/types'
import { speak } from '@/lib/speech'
import type { RecorderStatus } from '../useRecorder'
import { RatingButtons } from './RatingButtons'
import { RecordButton } from './RecordButton'
import { RecordingPlayer } from './RecordingPlayer'
import styles from '../Speaking.module.scss'

interface SentenceRowProps {
  sentence: ShadowSentence
  latest?: Recording
  recorder: { status: RecorderStatus; level: number; active: boolean }
  onRecord: () => void
  onStop: () => void
  onRate: (rating: SelfRating) => void
}

/** One sentence: hear it (normal or slow), record yourself, play back, rate. */
export function SentenceRow({
  sentence,
  latest,
  recorder,
  onRecord,
  onStop,
  onRate,
}: SentenceRowProps) {
  const s = useT().speaking
  return (
    <li className={styles.sentence}>
      <p className={styles.sentenceEn} lang="en">
        {sentence.en}
      </p>
      <p className={styles.sentenceUk} lang="uk">
        {sentence.uk}
      </p>
      {sentence.note && <p className={styles.note}>{sentence.note}</p>}
      <div className={styles.sentenceActions}>
        <Button
          size="sm"
          variant="ghost"
          icon={<Volume2 />}
          onClick={() => speak(sentence.en, 0.95)}
        >
          {s.listen}
        </Button>
        <Button size="sm" variant="ghost" icon={<Snail />} onClick={() => speak(sentence.en, 0.7)}>
          {s.listenSlow}
        </Button>
        <RecordButton
          status={recorder.status}
          active={recorder.active}
          level={recorder.level}
          onStart={onRecord}
          onStop={onStop}
        />
      </div>
      {latest && (
        <div className={styles.take}>
          <RecordingPlayer audio={latest.audio} label={s.playTake} />
          <RatingButtons value={latest.rating} onChange={onRate} />
        </div>
      )}
    </li>
  )
}

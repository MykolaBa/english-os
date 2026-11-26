import { SpeakButton } from '@/components/ui'
import type { WritingPrompt } from '@/content/writing'
import { useT } from '@/i18n'
import styles from '../Writing.module.scss'

/** Hidden until asked for: write your own first, then compare. */
export function SampleAnswer({ prompt }: { prompt: WritingPrompt }) {
  const w = useT().writing
  return (
    <details className={styles.sample}>
      <summary>{w.sample}</summary>
      <div className={styles.sampleBody}>
        <p className={styles.muted}>
          {w.sampleNote} <SpeakButton text={prompt.sample} />
        </p>
        <p className={styles.sampleText} lang="en">
          {prompt.sample}
        </p>
      </div>
    </details>
  )
}

import { SpeakButton } from '@/components/ui'
import type { InterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import { PhraseList } from './PhraseList'
import styles from '../ItEnglish.module.scss'

/** Hidden until asked for: try your own answer first, then compare. */
export function ModelAnswer({ question }: { question: InterviewQuestion }) {
  const s = useT().itEnglish
  return (
    <details className={styles.model}>
      <summary>{s.showModel}</summary>
      <div className={styles.modelBody}>
        <h3 className={styles.subTitle}>{s.outline}</h3>
        <ol className={styles.outline} lang="en">
          {question.outline.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ol>
        <div className={styles.sampleHead}>
          <h3 className={styles.subTitle}>{s.sample}</h3>
          <SpeakButton text={question.sample} />
        </div>
        <p className={styles.sample} lang="en">
          {question.sample}
        </p>
        <h3 className={styles.subTitle}>{s.usefulPhrases}</h3>
        <PhraseList phrases={question.phrases} collectionSlug="interviews" />
      </div>
    </details>
  )
}

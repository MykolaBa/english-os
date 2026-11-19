import { SpeakButton } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import styles from '../Review.module.scss'

/** The English side of a card, set like a dictionary entry. */
export function Headword({ word }: { word: Word }) {
  const t = useT()
  return (
    <div className={styles.headwordBlock}>
      <div className={styles.headwordRow}>
        <p className={styles.headword} lang="en">
          {word.term}
        </p>
        <SpeakButton text={word.term} size="md" />
      </div>
      <p className={styles.grammar}>
        {word.phonetic && (
          <span className={styles.ipa} lang="en">
            {word.phonetic}
          </span>
        )}
        {word.partOfSpeech && <em>{t.partOfSpeech[word.partOfSpeech]}</em>}
      </p>
    </div>
  )
}

/** Everything else about the word: shown once the answer is revealed. */
export function WordDetails({
  word,
  showTranslations,
  hideTranslation,
}: {
  word: Word
  showTranslations: boolean
  hideTranslation?: boolean
}) {
  return (
    <div className={styles.details}>
      {!hideTranslation && (
        <p className={styles.sense} lang="uk">
          {word.translation}
        </p>
      )}
      {word.definition && (
        <p className={styles.definition} lang="en">
          {word.definition}
        </p>
      )}
      {word.example && (
        <div className={styles.example}>
          <p lang="en">{word.example}</p>
          {showTranslations && word.exampleTranslation && (
            <p className={styles.exampleTranslation} lang="uk">
              {word.exampleTranslation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

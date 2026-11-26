import { Card, SpeakButton } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { useSettings } from '@/stores/settingsStore'
import styles from '../../Vocabulary.module.scss'

function TagList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className={styles.detailBlock}>
      <h3 className={styles.blockTitle}>{title}</h3>
      <ul className={styles.tags}>
        {items.map((item) => (
          <li key={item} lang="en">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Definition, example, related words and notes — each card only when it has content. */
export function WordDetails({ word }: { word: Word }) {
  const d = useT().vocabulary.detail
  const showTranslations = useSettings((s) => s.showTranslations)
  const hasRelated =
    word.synonyms.length > 0 ||
    word.antonyms.length > 0 ||
    word.collocations.length > 0 ||
    Boolean(word.notes)

  return (
    <>
      {(word.definition || word.example) && (
        <Card>
          {word.definition && (
            <div className={styles.detailBlock}>
              <h3 className={styles.blockTitle}>{d.definition}</h3>
              <p className={styles.definition} lang="en">
                {word.definition}
              </p>
            </div>
          )}
          {word.example && (
            <div className={styles.detailBlock}>
              <h3 className={styles.blockTitle}>{d.example}</h3>
              <blockquote className={styles.example}>
                <p lang="en">
                  {word.example} <SpeakButton text={word.example} />
                </p>
                {showTranslations && word.exampleTranslation && (
                  <p className={styles.exampleTranslation} lang="uk">
                    {word.exampleTranslation}
                  </p>
                )}
              </blockquote>
            </div>
          )}
        </Card>
      )}
      {hasRelated && (
        <Card>
          <TagList title={d.synonyms} items={word.synonyms} />
          <TagList title={d.antonyms} items={word.antonyms} />
          <TagList title={d.collocations} items={word.collocations} />
          {word.notes && (
            <div className={styles.detailBlock}>
              <h3 className={styles.blockTitle}>{d.notes}</h3>
              <p className={styles.notes}>{word.notes}</p>
            </div>
          )}
        </Card>
      )}
    </>
  )
}

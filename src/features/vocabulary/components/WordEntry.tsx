import { Star } from 'lucide-react'
import { Link } from 'react-router'
import { Button, SpeakButton } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import { toggleFavorite } from '../wordsRepo'
import { StatusBadge } from './StatusBadge'
import styles from '../Vocabulary.module.scss'

/**
 * One dictionary entry in the list. The whole row is clickable via a "stretched link"
 * (the headword's ::after covers the row), while the speak/favorite buttons sit above it —
 * valid HTML, no nested interactive elements.
 */
export function WordEntry({ word }: { word: Word }) {
  const t = useT()
  return (
    <li className={styles.entry}>
      <div className={styles.entryMain}>
        <p className={styles.entryHead}>
          <Link
            to={`/vocabulary/${encodeURIComponent(word.id)}`}
            className={styles.headword}
            lang="en"
          >
            {word.term}
          </Link>
          {word.phonetic && (
            <span className={styles.ipa} lang="en">
              {word.phonetic}
            </span>
          )}
          {word.partOfSpeech && <em className={styles.pos}>{t.partOfSpeech[word.partOfSpeech]}</em>}
        </p>
        <p className={styles.translation} lang="uk">
          {word.translation}
        </p>
      </div>
      <div className={styles.entrySide}>
        {/* Every word starts as "new"; the badge only earns its place once learning begins. */}
        {word.srs.status !== 'new' && <StatusBadge status={word.srs.status} />}
        {word.level && <span className={styles.level}>{word.level}</span>}
        <div className={styles.entryActions}>
          <SpeakButton text={word.term} />
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            className={cx(styles.star, word.favorite && styles.starOn)}
            icon={<Star />}
            aria-pressed={word.favorite}
            aria-label={word.favorite ? t.vocabulary.unfavorite : t.vocabulary.favorite}
            onClick={() => void toggleFavorite(word.id)}
          />
        </div>
      </div>
    </li>
  )
}

import { Star } from 'lucide-react'
import { Link } from 'react-router'
import { Badge, Button } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import { toggleFavorite } from '../wordsRepo'
import { SpeakButton } from './SpeakButton'
import { StatusBadge } from './StatusBadge'
import styles from '../Vocabulary.module.scss'

/**
 * The whole card is clickable via a "stretched link" (the term's ::after covers the card),
 * while the speak/favorite buttons sit above it — valid HTML, no nested interactive elements.
 */
export function WordCard({ word }: { word: Word }) {
  const t = useT()
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardHeading}>
          <Link to={`/vocabulary/${encodeURIComponent(word.id)}`} className={styles.cardLink}>
            {word.term}
          </Link>
          {word.phonetic && <span className={styles.phonetic}>{word.phonetic}</span>}
        </div>
        <div className={styles.cardActions}>
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
      <p className={styles.translation}>{word.translation}</p>
      <div className={styles.cardMeta}>
        <StatusBadge status={word.srs.status} />
        {word.level && <Badge>{word.level}</Badge>}
        {word.partOfSpeech && (
          <span className={styles.pos}>{t.partOfSpeech[word.partOfSpeech]}</span>
        )}
      </div>
    </article>
  )
}

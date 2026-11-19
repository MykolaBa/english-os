import { Badge, Button } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import { Headword, WordDetails } from './WordFace'
import styles from '../Review.module.scss'

interface FlashcardProps {
  word: Word
  /** English → Ukrainian (front shows the word) or the reverse (front shows the translation). */
  direction: 'en-uk' | 'uk-en'
  revealed: boolean
  showTranslations: boolean
  onReveal: () => void
}

export function Flashcard({
  word,
  direction,
  revealed,
  showTranslations,
  onReveal,
}: FlashcardProps) {
  const t = useT()
  const isNew = word.srs.status === 'new'

  const front =
    direction === 'en-uk' ? (
      <Headword word={word} />
    ) : (
      <div className={styles.promptBlock}>
        <p className={styles.prompt} lang="uk">
          {word.translation}
        </p>
        {word.partOfSpeech && (
          <p className={styles.promptPos}>{t.partOfSpeech[word.partOfSpeech]}</p>
        )}
      </div>
    )

  return (
    <div className={styles.cardStage}>
      {/* Keyed by side, so revealing replays the turn animation on the new face. */}
      {/* Clicking the card is a mouse/touch shortcut; the real control is the button below
          (and Space), so nested interactive elements like the speak button stay valid. */}
      <article
        key={revealed ? 'back' : 'front'}
        className={cx(styles.card, revealed && styles.turned, !revealed && styles.clickable)}
        onClick={revealed ? undefined : onReveal}
      >
        {isNew && (
          <Badge tone="info" className={styles.newBadge}>
            {t.review.session.newWord}
          </Badge>
        )}
        {revealed ? (
          <>
            <Headword word={word} />
            <WordDetails word={word} showTranslations={showTranslations} />
          </>
        ) : (
          <div className={styles.cardFront}>{front}</div>
        )}
      </article>
      {!revealed && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className={styles.revealButton}
          onClick={onReveal}
        >
          {t.review.session.show}
        </Button>
      )}
    </div>
  )
}

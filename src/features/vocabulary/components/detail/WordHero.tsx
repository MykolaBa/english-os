import { Pencil, Star, Trash2 } from 'lucide-react'
import { Badge, Button, Card, SpeakButton } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import { toggleFavorite } from '../../wordsRepo'
import { StatusBadge } from '../StatusBadge'
import styles from '../../Vocabulary.module.scss'

interface WordHeroProps {
  word: Word
  onEdit: () => void
  onDelete: () => void
}

/** The dictionary entry itself: headword, IPA, translation, and what you can do with it. */
export function WordHero({ word, onEdit, onDelete }: WordHeroProps) {
  const t = useT()
  const d = t.vocabulary.detail
  return (
    <Card padding="lg" className={styles.hero}>
      <div className={styles.heroTop}>
        <div className={styles.heroBadges}>
          <StatusBadge status={word.srs.status} />
          {word.level && <Badge>{word.level}</Badge>}
          {word.partOfSpeech && <Badge>{t.partOfSpeech[word.partOfSpeech]}</Badge>}
          {word.source === 'seed' && <Badge tone="info">{d.starter}</Badge>}
        </div>
        <div className={styles.heroActions}>
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
          <Button size="sm" icon={<Pencil />} onClick={onEdit}>
            {t.common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Trash2 />}
            aria-label={t.common.delete}
            onClick={onDelete}
          />
        </div>
      </div>
      <div className={styles.heroTerm}>
        <h1 lang="en">{word.term}</h1>
        <SpeakButton text={word.term} size="md" />
      </div>
      {word.phonetic && <p className={styles.heroPhonetic}>{word.phonetic}</p>}
      <p className={styles.heroTranslation} lang="uk">
        {word.translation}
      </p>
    </Card>
  )
}

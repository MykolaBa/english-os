import { BookmarkPlus, CircleCheck, MousePointerClick, X } from 'lucide-react'
import { Link } from 'react-router'
import { Button, ButtonLink, SpeakButton } from '@/components/ui'
import type { GlossaryItem } from '@/content/reading'
import { useT } from '@/i18n'
import type { KnownMatch } from '../selection'
import styles from '../Reading.module.scss'

interface WordPanelProps {
  /** The headword to show: the glossary term, or the word as written in the text. */
  headword: string | null
  gloss?: GlossaryItem
  known?: KnownMatch
  onAdd: () => void
  onClose: () => void
  /** What to say when there's no translation (default: the graded-reading hint). */
  noTranslationHint?: string
}

/**
 * The selected word, like a dictionary entry. Desktop: a sticky column next to the text.
 * Phone: a sheet above the bottom navigation that appears only while a word is selected.
 */
export function WordPanel({
  headword,
  gloss,
  known,
  onAdd,
  onClose,
  noTranslationHint,
}: WordPanelProps) {
  const t = useT()
  const r = t.reading

  if (!headword) {
    return (
      <aside className={styles.panel} data-empty>
        <MousePointerClick className={styles.panelHintIcon} aria-hidden />
        <p className={styles.panelHint}>{r.tapHint}</p>
      </aside>
    )
  }

  // A guessed base form ("news" → "new") may be another word: show it as related, not as this one.
  const saved = known?.exact ? known.word : undefined
  const related = known && !known.exact ? known.word : undefined
  const translation = saved?.translation ?? gloss?.translation
  const partOfSpeech = saved?.partOfSpeech ?? gloss?.partOfSpeech

  return (
    <aside className={styles.panel} aria-live="polite" aria-label={headword}>
      <div className={styles.panelHead}>
        <p className={styles.headword} lang="en">
          {headword}
        </p>
        <SpeakButton text={headword} />
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon={<X />}
          aria-label={r.closePanel}
          className={styles.panelClose}
          onClick={onClose}
        />
      </div>
      {partOfSpeech && <p className={styles.pos}>{t.partOfSpeech[partOfSpeech]}</p>}
      {translation ? (
        <p className={styles.translation} lang="uk">
          {translation}
        </p>
      ) : (
        <p className={styles.panelHint}>{noTranslationHint ?? r.noTranslation}</p>
      )}
      {related && (
        <p className={styles.related}>
          {r.related}{' '}
          <Link to={`/vocabulary/${related.id}`} lang="en">
            {related.term}
          </Link>
          {' — '}
          <span lang="uk">{related.translation}</span>
        </p>
      )}
      {saved ? (
        <div className={styles.panelActions}>
          <span className={styles.knownLabel}>
            <CircleCheck aria-hidden /> {r.inVocabulary}
          </span>
          <ButtonLink to={`/vocabulary/${saved.id}`} variant="ghost" size="sm">
            {r.openWord}
          </ButtonLink>
        </div>
      ) : (
        <div className={styles.panelActions}>
          <Button variant="primary" size="sm" icon={<BookmarkPlus />} onClick={onAdd}>
            {r.addWord}
          </Button>
        </div>
      )}
    </aside>
  )
}

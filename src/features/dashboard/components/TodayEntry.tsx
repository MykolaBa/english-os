import { Plus, Repeat } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, ProgressBar, SpeakButton } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import styles from './TodayEntry.module.scss'

interface TodayEntryProps {
  word: Word | null
  dueCount: number
  newWords: number
  todayXp: number
  goal: number
}

/**
 * The dashboard opens with the thing this app is about: a word, set like a dictionary
 * entry. It is the next word worth your attention — the most overdue review, otherwise
 * the newest word you haven't started.
 */
export function TodayEntry({ word, dueCount, newWords, todayXp, goal }: TodayEntryProps) {
  const t = useT()
  const g = t.dashboard.goal
  const reached = todayXp >= goal

  const meter = (
    <div className={cx(styles.meter, reached && styles.meterDone)}>
      <span className={styles.meterText}>{g.meter(todayXp, goal)}</span>
      <ProgressBar
        value={goal > 0 ? todayXp / goal : 0}
        label={g.meterLabel}
        size="sm"
        tone={reached ? 'success' : 'brand'}
      />
    </div>
  )

  if (!word) {
    return (
      <section className={styles.entry}>
        <div className={styles.top}>{meter}</div>
        <h2 className={styles.emptyTitle}>{g.emptyTitle}</h2>
        <p className={styles.emptyText}>{g.emptyText}</p>
        <div className={styles.actions}>
          <ButtonLink to="/vocabulary?add=1" variant="primary" size="lg" icon={<Plus />}>
            {g.addWords}
          </ButtonLink>
        </div>
      </section>
    )
  }

  const isNew = word.srs.status === 'new'
  const reason = reached ? g.reasonDone : isNew ? g.reasonNew : g.reasonDue
  const others = isNew ? newWords - 1 : dueCount - 1
  const href = `/vocabulary/${encodeURIComponent(word.id)}`

  return (
    <section className={styles.entry} aria-labelledby="today-headword">
      <div className={styles.top}>
        <p className={styles.reason}>{reason}</p>
        {meter}
      </div>

      <div className={styles.headwordRow}>
        <h2 id="today-headword" className={styles.headword} lang="en">
          <Link to={href}>{word.term}</Link>
        </h2>
        <SpeakButton text={word.term} size="md" />
      </div>

      <p className={styles.grammar}>
        {word.phonetic && (
          <span className={styles.ipa} lang="en">
            {word.phonetic}
          </span>
        )}
        {word.partOfSpeech && <em>{t.partOfSpeech[word.partOfSpeech]}</em>}
        {word.level && <span className={styles.level}>{word.level}</span>}
      </p>

      <p className={styles.sense} lang="uk">
        {word.translation}
      </p>
      {word.example && (
        <p className={styles.example} lang="en">
          {word.example}
        </p>
      )}

      <div className={styles.actions}>
        <ButtonLink to="/review" variant="primary" size="lg" icon={<Repeat />}>
          {isNew ? g.startLearning : g.startReview}
        </ButtonLink>
        <ButtonLink to={href} variant="ghost" size="lg">
          {g.openWord}
        </ButtonLink>
        {others > 0 && (
          <span className={styles.queue}>{isNew ? g.moreNew(others) : g.moreDue(others)}</span>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { formatDate, formatDue } from '@/lib/date'
import type { Collection, Word } from '@/lib/db/types'
import { CollectionIcon } from '../CollectionIcon'
import { StatusBadge } from '../StatusBadge'
import styles from '../../Vocabulary.module.scss'

/** The side column: where the word is in the review cycle, and its collections. */
export function WordProgress({ word, collections }: { word: Word; collections: Collection[] }) {
  const t = useT()
  const d = t.vocabulary.detail
  // Captured once per visit: "next review" doesn't need to tick live.
  const [now] = useState(() => Date.now())
  const started = word.srs.status !== 'new'
  const answers = word.srs.correctCount + word.srs.incorrectCount
  const wordCollections = collections.filter((c) => word.collectionIds.includes(c.id))

  return (
    <aside className={styles.detailSide}>
      <Card>
        <CardHeader title={d.progress} />
        <dl className={styles.facts}>
          <div>
            <dt>{d.status}</dt>
            <dd>
              <StatusBadge status={word.srs.status} />
            </dd>
          </div>
          <div>
            <dt>{d.nextReview}</dt>
            <dd>
              {!started
                ? d.notScheduled
                : word.srs.dueAt <= now
                  ? d.dueNow
                  : formatDue(word.srs.dueAt, t.locale, t.common.justNow, now)}
            </dd>
          </div>
          <div>
            <dt>{d.reviews}</dt>
            <dd>{word.srs.reps}</dd>
          </div>
          <div>
            <dt>{d.correctAnswers}</dt>
            <dd>{answers === 0 ? d.noAnswers : d.correctOf(word.srs.correctCount, answers)}</dd>
          </div>
          <div>
            <dt>{d.added}</dt>
            <dd>{formatDate(word.createdAt, t.locale)}</dd>
          </div>
        </dl>
      </Card>
      {wordCollections.length > 0 && (
        <Card>
          <CardHeader title={d.collections} />
          <ul className={styles.collectionLinks}>
            {wordCollections.map((c) => (
              <li key={c.id}>
                <Link to={`/vocabulary?collection=${encodeURIComponent(c.id)}`}>
                  <CollectionIcon name={c.icon} />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </aside>
  )
}

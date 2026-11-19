import { useState } from 'react'
import { ArrowLeft, Pencil, SearchX, Star, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardHeader,
  ConfirmDialog,
  EmptyState,
  Skeleton,
} from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { formatDate, formatRelative } from '@/lib/date'
import { useSettings } from '@/stores/settingsStore'
import { toast } from '@/stores/toastStore'
import { CollectionIcon } from './components/CollectionIcon'
import { SpeakButton } from './components/SpeakButton'
import { StatusBadge } from './components/StatusBadge'
import { WordFormDialog } from './components/WordFormDialog'
import { useCollections, useWord } from './hooks'
import { accuracy } from './model'
import { deleteWord, toggleFavorite } from './wordsRepo'
import styles from './Vocabulary.module.scss'

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

export default function WordDetailPage() {
  const { wordId } = useParams()
  const word = useWord(wordId)
  const collections = useCollections()
  const showTranslations = useSettings((s) => s.showTranslations)
  const navigate = useNavigate()
  const t = useT()
  const d = t.vocabulary.detail
  const [editOpen, setEditOpen] = useState(false)
  const [editKey, setEditKey] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  // Captured once per visit: "next review" doesn't need to tick live.
  const [now] = useState(() => Date.now())

  const back = (
    <Link to="/vocabulary" className={styles.backLink}>
      <ArrowLeft aria-hidden /> {d.back}
    </Link>
  )

  if (word === undefined) {
    return (
      <>
        {back}
        <Skeleton height={220} />
      </>
    )
  }

  if (word === null) {
    return (
      <>
        {back}
        <Card padding="lg">
          <EmptyState
            icon={<SearchX />}
            title={d.notFoundTitle}
            description={d.notFoundText}
            action={<ButtonLink to="/vocabulary">{d.back}</ButtonLink>}
          />
        </Card>
      </>
    )
  }

  const wordCollections = (collections ?? []).filter((c) => word.collectionIds.includes(c.id))
  const acc = accuracy(word.srs)
  const started = word.srs.status !== 'new'

  return (
    <>
      {back}
      <div className={styles.detailLayout}>
        <div className={styles.detailMain}>
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
                <Button
                  size="sm"
                  icon={<Pencil />}
                  onClick={() => {
                    setEditKey((k) => k + 1)
                    setEditOpen(true)
                  }}
                >
                  {t.common.edit}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<Trash2 />}
                  aria-label={t.common.delete}
                  onClick={() => setConfirmDelete(true)}
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

          {(word.definition || word.example) && (
            <Card>
              {word.definition && (
                <div className={styles.detailBlock}>
                  <h3 className={styles.blockTitle}>{d.definition}</h3>
                  <p lang="en">{word.definition}</p>
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

          {(word.synonyms.length > 0 ||
            word.antonyms.length > 0 ||
            word.collocations.length > 0 ||
            word.notes) && (
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
        </div>

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
                      : formatRelative(word.srs.dueAt, t.locale, t.common.justNow, now)}
                </dd>
              </div>
              <div>
                <dt>{d.reviews}</dt>
                <dd>{word.srs.reps}</dd>
              </div>
              <div>
                <dt>{d.accuracy}</dt>
                <dd>{acc === null ? '—' : `${Math.round(acc * 100)}%`}</dd>
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
      </div>

      {collections && (
        <WordFormDialog
          key={editKey}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          collections={collections}
          word={word}
        />
      )}
      <ConfirmDialog
        open={confirmDelete}
        title={d.deleteTitle(word.term)}
        description={d.deleteText}
        confirmLabel={t.common.delete}
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteWord(word.id)
          toast.success(d.deleted(word.term))
          navigate('/vocabulary', { replace: true })
        }}
      />
    </>
  )
}

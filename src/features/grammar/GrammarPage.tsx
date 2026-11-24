import { useDeferredValue, useMemo, useState } from 'react'
import { Bookmark, Search, SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { Button, Card, Chip, EmptyState, PageHeader, Select, Skeleton } from '@/components/ui'
import { GRAMMAR_CATEGORIES, GRAMMAR_LESSONS, type GrammarCategory } from '@/content/grammar'
import { useT } from '@/i18n'
import { CEFR_LEVELS, type CefrLevel } from '@/lib/db/types'
import { LessonStatus } from './components/LessonStatus'
import { useAllProgress } from './hooks'
import styles from './Grammar.module.scss'

/** Only offer levels and topics that actually have lessons. */
const LEVELS = CEFR_LEVELS.filter((l) => GRAMMAR_LESSONS.some((lesson) => lesson.level === l))
const CATEGORIES = GRAMMAR_CATEGORIES.filter((c) =>
  GRAMMAR_LESSONS.some((lesson) => lesson.category === c),
)

export default function GrammarPage() {
  const t = useT()
  const g = t.grammar
  const progress = useAllProgress()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<CefrLevel | ''>('')
  const [category, setCategory] = useState<GrammarCategory | ''>('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const search = useDeferredValue(query.trim().toLowerCase())

  const visible = useMemo(
    () =>
      GRAMMAR_LESSONS.filter(
        (lesson) =>
          (!level || lesson.level === level) &&
          (!category || lesson.category === category) &&
          (!bookmarkedOnly || progress?.get(lesson.id)?.bookmarked) &&
          (!search || `${lesson.title} ${lesson.summary}`.toLowerCase().includes(search)),
      ),
    [level, category, bookmarkedOnly, progress, search],
  )

  const completed = GRAMMAR_LESSONS.filter(
    (l) => progress?.get(l.id)?.status === 'completed',
  ).length
  const clear = () => {
    setQuery('')
    setLevel('')
    setCategory('')
    setBookmarkedOnly(false)
  }

  return (
    <>
      <PageHeader title={g.title} description={g.subtitle(completed, GRAMMAR_LESSONS.length)} />

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <Search aria-hidden />
          <span className="visually-hidden">{g.searchLabel}</span>
          <input
            type="search"
            value={query}
            placeholder={g.searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className={styles.filters}>
          <Select<CefrLevel | ''>
            variant="pill"
            aria-label={g.level}
            value={level}
            onChange={setLevel}
            options={[
              { value: '', label: g.allLevels },
              ...LEVELS.map((l) => ({ value: l, label: l })),
            ]}
          />
          <Select<GrammarCategory | ''>
            variant="pill"
            aria-label={g.category}
            value={category}
            onChange={setCategory}
            options={[
              { value: '', label: g.allCategories },
              ...CATEGORIES.map((c) => ({ value: c, label: g.categories[c] })),
            ]}
          />
          <Chip
            selected={bookmarkedOnly}
            icon={<Bookmark />}
            onClick={() => setBookmarkedOnly((b) => !b)}
          >
            {g.bookmarked}
          </Chip>
        </div>
      </div>

      {!progress ? (
        <Skeleton height={360} />
      ) : visible.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<SearchX />}
            title={g.noResultsTitle}
            description={g.noResultsText}
            action={<Button onClick={clear}>{g.clearFilters}</Button>}
          />
        </Card>
      ) : (
        LEVELS.filter((l) => visible.some((lesson) => lesson.level === l)).map((l) => (
          <section key={l} className={styles.levelGroup} aria-labelledby={`level-${l}`}>
            <h2 id={`level-${l}`} className={styles.levelHeading}>
              {g.levelHeading(l)}
            </h2>
            <ul className={styles.list}>
              {visible
                .filter((lesson) => lesson.level === l)
                .map((lesson) => {
                  const p = progress.get(lesson.id)
                  return (
                    <li key={lesson.id} className={styles.row}>
                      <Link to={`/grammar/${lesson.id}`} className={styles.rowLink}>
                        <span className={styles.rowTitle} lang="en">
                          {lesson.title}
                          {p?.bookmarked && (
                            <Bookmark className={styles.bookmarkIcon} aria-label={g.bookmarked} />
                          )}
                        </span>
                        <span className={styles.rowSummary}>{lesson.summary}</span>
                      </Link>
                      <span className={styles.rowMeta}>
                        <LessonStatus progress={p} />
                        <span className={styles.rowCategory}>{g.categories[lesson.category]}</span>
                      </span>
                    </li>
                  )
                })}
            </ul>
          </section>
        ))
      )}
    </>
  )
}

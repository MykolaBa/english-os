import { useDeferredValue, useMemo, useState } from 'react'
import { Library, Plus, SearchX } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Badge, Button, Card, EmptyState, PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { formatRelative } from '@/lib/date'
import { LibraryItemDialog } from './components/LibraryItemDialog'
import { LibraryToolbar } from './components/LibraryToolbar'
import { useLibrary } from './hooks'
import { filterLibrary, tagsInUse, type LibraryFilters } from './text'
import styles from './Library.module.scss'

const NO_FILTERS: LibraryFilters = { query: '', status: null, tag: null }

export default function LibraryPage() {
  const t = useT()
  const l = t.library
  const items = useLibrary()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [filters, setFilters] = useState(NO_FILTERS)
  // Typing stays responsive: the list follows the deferred query.
  const query = useDeferredValue(filters.query)
  const { status, tag } = filters
  const visible = useMemo(
    () => (items ? filterLibrary(items, { query, status, tag }) : []),
    [items, query, status, tag],
  )
  const tags = useMemo(() => (items ? tagsInUse(items) : []), [items])
  // Counted once per change of the items, not on every keystroke in the search box.
  const wordCounts = useMemo(
    () => new Map((items ?? []).map((i) => [i.id, i.text ? i.text.split(/\s+/).length : 0])),
    [items],
  )
  const addButton = (
    <Button variant="primary" icon={<Plus />} onClick={() => setAdding(true)}>
      {l.add}
    </Button>
  )

  return (
    <>
      <PageHeader title={l.title} description={l.subtitle} actions={addButton} />
      {!items ? (
        <Skeleton height={320} />
      ) : items.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Library />}
            title={l.emptyTitle}
            description={l.emptyText}
            action={addButton}
          />
        </Card>
      ) : (
        <>
          <LibraryToolbar
            filters={filters}
            tags={tags}
            onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
          />
          {visible.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={<SearchX />}
                title={l.noResultsTitle}
                description={l.noResultsText}
                action={<Button onClick={() => setFilters(NO_FILTERS)}>{l.clearFilters}</Button>}
              />
            </Card>
          ) : (
            <ul className={styles.list}>
              {visible.map((item) => (
                <li key={item.id}>
                  <Link to={`/library/${item.id}`} className={styles.row}>
                    <span className={styles.rowMain}>
                      <span className={styles.rowTitle} lang="en">
                        {item.title}
                      </span>
                      <span className={styles.rowText}>
                        {l.rowMeta(
                          wordCounts.get(item.id) ?? 0,
                          formatRelative(item.updatedAt, t.locale, t.common.justNow),
                        )}
                      </span>
                      {item.tags.length > 0 && (
                        <span className={styles.tags}>
                          {item.tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </span>
                      )}
                    </span>
                    <Badge
                      tone={
                        item.status === 'done'
                          ? 'success'
                          : item.status === 'reading'
                            ? 'accent'
                            : undefined
                      }
                    >
                      {l.statuses[item.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {adding && (
        <LibraryItemDialog
          onClose={() => setAdding(false)}
          onSaved={(id) => navigate(`/library/${id}`)}
        />
      )}
    </>
  )
}

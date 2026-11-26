import { Search } from 'lucide-react'
import { Select } from '@/components/ui'
import { useT } from '@/i18n'
import { LIBRARY_STATUSES, type LibraryStatus } from '@/lib/db/types'
import { parseOneOf } from '@/lib/guards'
import type { LibraryFilters } from '../text'
import styles from '../Library.module.scss'

interface Props {
  filters: LibraryFilters
  tags: string[]
  onChange: (patch: Partial<LibraryFilters>) => void
}

/** Search box plus status and tag filters (pill selects, never a native <select>). */
export function LibraryToolbar({ filters, tags, onChange }: Props) {
  const l = useT().library
  return (
    <div className={styles.toolbar}>
      <label className={styles.search}>
        <Search aria-hidden />
        <span className="visually-hidden">{l.searchLabel}</span>
        <input
          type="search"
          value={filters.query}
          placeholder={l.searchPlaceholder}
          onChange={(e) => onChange({ query: e.target.value })}
        />
      </label>
      <Select<LibraryStatus | ''>
        variant="pill"
        aria-label={l.status}
        value={filters.status ?? ''}
        options={[
          { value: '', label: l.anyStatus },
          ...LIBRARY_STATUSES.map((s) => ({ value: s, label: l.statuses[s] })),
        ]}
        onChange={(v) => onChange({ status: parseOneOf(LIBRARY_STATUSES, v) })}
      />
      {tags.length > 0 && (
        <Select<string>
          variant="pill"
          aria-label={l.anyTag}
          value={filters.tag ?? ''}
          options={[
            { value: '', label: l.anyTag },
            ...tags.map((tag) => ({ value: tag, label: `#${tag}` })),
          ]}
          onChange={(v) => onChange({ tag: v || null })}
        />
      )}
    </div>
  )
}

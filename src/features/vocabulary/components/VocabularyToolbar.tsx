import { Search, Star, X } from 'lucide-react'
import { Button, Chip, Select } from '@/components/ui'
import { useT } from '@/i18n'
import { CEFR_LEVELS, type CefrLevel, type WordStatus } from '@/lib/db/types'
import {
  hasActiveFilters,
  WORD_SORTS,
  WORD_STATUSES,
  type WordFilters,
  type WordSort,
} from '../filters'
import styles from '../Vocabulary.module.scss'

interface ToolbarProps {
  filters: WordFilters
  onChange: (patch: Partial<WordFilters>) => void
  onClear: () => void
}

export function VocabularyToolbar({ filters, onChange, onClear }: ToolbarProps) {
  const t = useT()
  const v = t.vocabulary
  return (
    <div className={styles.toolbar}>
      <label className={styles.search}>
        <Search aria-hidden />
        <span className="visually-hidden">{v.searchLabel}</span>
        <input
          type="search"
          value={filters.query}
          placeholder={v.searchPlaceholder}
          onChange={(e) => onChange({ query: e.target.value })}
          enterKeyHint="search"
        />
      </label>
      <div className={styles.filterRow}>
        <Select<WordStatus | ''>
          variant="pill"
          aria-label={v.filters.status}
          value={filters.status ?? ''}
          onChange={(status) => onChange({ status: status || null })}
          options={[
            { value: '', label: v.filters.anyStatus },
            ...WORD_STATUSES.map((s) => ({ value: s, label: t.status[s] })),
          ]}
        />
        <Select<CefrLevel | ''>
          variant="pill"
          aria-label={v.filters.level}
          value={filters.level ?? ''}
          onChange={(level) => onChange({ level: level || null })}
          options={[
            { value: '', label: v.filters.anyLevel },
            ...CEFR_LEVELS.map((l) => ({ value: l, label: l })),
          ]}
        />
        <Select<WordSort>
          variant="pill"
          aria-label={v.filters.sort}
          value={filters.sort}
          onChange={(sort) => onChange({ sort })}
          options={WORD_SORTS.map((s) => ({ value: s, label: v.sort[s] }))}
        />
        <Chip
          selected={filters.favoritesOnly}
          icon={<Star />}
          onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
        >
          {v.filters.favorites}
        </Chip>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" icon={<X />} onClick={onClear}>
            {v.filters.clear}
          </Button>
        )}
      </div>
    </div>
  )
}

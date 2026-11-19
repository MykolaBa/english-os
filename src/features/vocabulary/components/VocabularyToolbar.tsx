import { Search, Star, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button, Chip } from '@/components/ui'
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

function CompactSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className={styles.compactSelect}>
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  )
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
        <CompactSelect
          label={v.filters.status}
          value={filters.status ?? ''}
          onChange={(value) => onChange({ status: (value || null) as WordStatus | null })}
        >
          <option value="">{v.filters.anyStatus}</option>
          {WORD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t.status[s]}
            </option>
          ))}
        </CompactSelect>
        <CompactSelect
          label={v.filters.level}
          value={filters.level ?? ''}
          onChange={(value) => onChange({ level: (value || null) as CefrLevel | null })}
        >
          <option value="">{v.filters.anyLevel}</option>
          {CEFR_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </CompactSelect>
        <CompactSelect
          label={v.filters.sort}
          value={filters.sort}
          onChange={(value) => onChange({ sort: value as WordSort })}
        >
          {WORD_SORTS.map((s) => (
            <option key={s} value={s}>
              {v.sort[s]}
            </option>
          ))}
        </CompactSelect>
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

import styles from '../Statistics.module.scss'

export interface BarListItem {
  key: string
  label: string
  value: number
  /** Text next to the label, e.g. "120 XP"; defaults to the value. */
  display?: string
}

/**
 * Horizontal bars for a handful of categories. Plain HTML: the label and number are
 * real text (readable, translatable, selectable), so no chart library or legend is needed.
 */
export function BarList({ items, label }: { items: BarListItem[]; label: string }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className={styles.barList} aria-label={label}>
      {items.map((item) => (
        <li key={item.key} className={styles.barRow}>
          <span className={styles.barLabel}>{item.label}</span>
          <span className={styles.barValue}>{item.display ?? item.value}</span>
          <span className={styles.barTrack} aria-hidden>
            <span
              className={styles.barFill}
              style={{ width: `${item.value === 0 ? 0 : Math.max(2, (item.value / max) * 100)}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  )
}

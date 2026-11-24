import type { ReactNode } from 'react'
import styles from '../Statistics.module.scss'

/** The hover card shared by both charts: the bucket's date, then its values. */
export function ChartTooltip({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTitle}>{title}</p>
      {children}
    </div>
  )
}

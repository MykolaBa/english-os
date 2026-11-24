import type { ReactNode } from 'react'
import { useT } from '@/i18n'
import styles from '../Statistics.module.scss'

interface ChartTableProps {
  columns: string[]
  rows: { key: string; cells: ReactNode[] }[]
}

/** The chart's data as a plain table — for screen readers, exact numbers and copying. */
export function ChartTable({ columns, rows }: ChartTableProps) {
  const t = useT().statistics.table
  return (
    <details className={styles.tableToggle}>
      <summary>{t.show}</summary>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                {row.cells.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

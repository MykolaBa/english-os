import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { fromDayKey } from '@/lib/date'
import type { WeekDay } from '../week'
import styles from '../Planner.module.scss'

/** Monday to Sunday: a filled dot for days you studied, a ring for planned ones. */
export function WeekStrip({ week }: { week: WeekDay[] }) {
  const t = useT()
  const p = t.planner
  return (
    <ol className={styles.week}>
      {week.map((d) => {
        const date = fromDayKey(d.day)
        const short = date.toLocaleDateString(t.locale, { weekday: 'short' })
        const long = date.toLocaleDateString(t.locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
        const status = d.studied
          ? p.dayStatus.studied
          : !d.planned
            ? p.dayStatus.off
            : d.isFuture || d.isToday
              ? p.dayStatus.planned
              : p.dayStatus.missed
        return (
          <li
            key={d.day}
            className={cx(
              styles.day,
              d.planned && styles.dayPlanned,
              d.studied && styles.dayStudied,
              d.isToday && styles.dayToday,
              d.planned && !d.studied && !d.isFuture && !d.isToday && styles.dayMissed,
            )}
          >
            {/* Read as a sentence by screen readers; the visual part is hidden from them. */}
            <span className="visually-hidden">{p.dayLabel(long, status, d.xp)}</span>
            <span className={styles.dayName} aria-hidden>
              {short}
            </span>
            <span className={styles.dot} aria-hidden />
            <span className={styles.dayXp} aria-hidden>
              {d.xp > 0 ? d.xp : ''}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

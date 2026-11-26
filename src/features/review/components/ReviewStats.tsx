import { CalendarClock } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { weekdayShort } from '@/lib/date'
import type { OverviewStats } from '../overviewStats'
import styles from '../Review.module.scss'

/** Today's numbers: due, overdue, new words introduced, answers given. */
export function ReviewStats({ stats, newPerDay }: { stats: OverviewStats; newPerDay: number }) {
  const o = useT().review.overview
  const newLeft = Math.max(0, newPerDay - stats.introducedToday)
  return (
    <dl className={styles.stats}>
      <div>
        <dt>{o.stats.due}</dt>
        <dd>{stats.due}</dd>
      </div>
      <div>
        <dt>{o.stats.overdue}</dt>
        <dd>{stats.overdue}</dd>
      </div>
      <div>
        <dt>{o.stats.newToday}</dt>
        <dd>
          {stats.introducedToday}
          <small>{o.stats.newLeft(newLeft, newPerDay)}</small>
        </dd>
      </div>
      <div>
        <dt>{o.stats.reviewed}</dt>
        <dd>
          {stats.answeredToday}
          <small>{o.stats.correct(stats.correctToday, stats.answeredToday)}</small>
        </dd>
      </div>
    </dl>
  )
}

/** How many reviews each of the next seven days holds. */
export function ReviewForecast({ days }: { days: OverviewStats['forecast'] }) {
  const t = useT()
  const o = t.review.overview
  const maxDay = Math.max(1, ...days.map((d) => d.count))
  return (
    <Card>
      <CardHeader
        icon={<CalendarClock />}
        title={o.forecastTitle}
        description={o.forecastDescription}
      />
      <ol className={styles.forecast}>
        {days.map((d, i) => (
          <li key={d.day}>
            <span className={cx(styles.forecastDay, i === 0 && styles.forecastToday)}>
              {i === 0 ? o.today : weekdayShort(d.day, t.locale)}
            </span>
            <span className={styles.forecastTrack} aria-hidden>
              <span style={{ width: `${(d.count / maxDay) * 100}%` }} />
            </span>
            <span className={styles.forecastCount}>{d.count}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

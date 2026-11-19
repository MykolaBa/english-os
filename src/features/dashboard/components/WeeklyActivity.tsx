import { ChartNoAxesColumn } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui'
import { cx } from '@/lib/cx'
import { toDayKey, weekdayShort } from '@/lib/date'
import type { DayActivity } from '../useDashboardData'
import styles from '../Dashboard.module.scss'

/**
 * Lightweight CSS bar chart. Recharts arrives with the Statistics module (phase 6);
 * for 7 bars plain elements are simpler, lighter and fully accessible.
 */
export function WeeklyActivity({ week, goal }: { week: DayActivity[]; goal: number }) {
  const max = Math.max(goal, ...week.map((d) => d.xp))
  const total = week.reduce((s, d) => s + d.xp, 0)
  const activeDays = week.filter((d) => d.xp > 0).length
  const today = toDayKey()

  return (
    <Card>
      <CardHeader
        icon={<ChartNoAxesColumn />}
        title="This week"
        description={`${total} XP · ${activeDays}/7 active days`}
      />
      <ol className={styles.bars} aria-label="XP per day, last 7 days">
        {week.map((d) => (
          <li key={d.day} className={styles.barCol}>
            <div className={styles.barTrack}>
              <div
                className={cx(
                  styles.bar,
                  d.xp >= goal && styles.barGoal,
                  d.xp === 0 && styles.barEmpty,
                )}
                style={{ height: `${max > 0 ? Math.max(4, (d.xp / max) * 100) : 4}%` }}
                title={`${d.xp} XP`}
              />
            </div>
            <span className={cx(styles.barLabel, d.day === today && styles.barToday)}>
              {weekdayShort(d.day)}
              <span className="visually-hidden">: {d.xp} XP</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

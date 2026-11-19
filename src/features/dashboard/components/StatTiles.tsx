import type { ReactNode } from 'react'
import { BookOpen, CalendarDays, Flame, Repeat } from 'lucide-react'
import { Link } from 'react-router'
import { cx } from '@/lib/cx'
import type { DashboardData } from '../useDashboardData'
import styles from '../Dashboard.module.scss'

interface TileProps {
  icon: ReactNode
  label: string
  value: number
  hint: string
  tone: 'violet' | 'blue' | 'teal' | 'amber'
  to?: string
}

function StatTile({ icon, label, value, hint, tone, to }: TileProps) {
  const body = (
    <>
      <span className={cx(styles.tileIcon, styles[tone])}>{icon}</span>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileValue}>{value.toLocaleString('en-US')}</span>
      <span className={styles.tileHint}>{hint}</span>
    </>
  )
  return to ? (
    <Link to={to} className={cx(styles.tile, styles.tileLink)}>
      {body}
    </Link>
  ) : (
    <div className={styles.tile}>{body}</div>
  )
}

export function StatTiles({ data }: { data: DashboardData }) {
  return (
    <div className={styles.tiles}>
      <StatTile
        icon={<Flame />}
        label="Streak"
        value={data.currentStreak}
        hint={data.longestStreak > 0 ? `Best: ${data.longestStreak} days` : 'Study today to start'}
        tone="amber"
      />
      <StatTile
        icon={<Repeat />}
        label="Due now"
        value={data.dueCount}
        hint={data.dueCount > 0 ? 'Ready for review' : 'All caught up'}
        tone="violet"
        to="/review"
      />
      <StatTile
        icon={<BookOpen />}
        label="Words"
        value={data.totalWords}
        hint={`${data.masteredWords} mastered`}
        tone="blue"
        to="/vocabulary"
      />
      <StatTile
        icon={<CalendarDays />}
        label="Study days"
        value={data.totalStudyDays}
        hint="Days with any practice"
        tone="teal"
      />
    </div>
  )
}

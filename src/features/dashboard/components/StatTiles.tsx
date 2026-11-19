import type { ReactNode } from 'react'
import { BookOpen, CalendarDays, Flame, Repeat } from 'lucide-react'
import { Link } from 'react-router'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { DashboardData } from '../useDashboardData'
import styles from '../Dashboard.module.scss'

interface TileProps {
  icon: ReactNode
  label: string
  value: number
  hint: string
  tone: 'violet' | 'blue' | 'teal' | 'amber'
  locale: string
  to?: string
}

function StatTile({ icon, label, value, hint, tone, locale, to }: TileProps) {
  const body = (
    <>
      <span className={cx(styles.tileIcon, styles[tone])}>{icon}</span>
      <span className={styles.tileLabel}>{label}</span>
      <span className={styles.tileValue}>{value.toLocaleString(locale)}</span>
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
  const { locale, dashboard } = useT()
  const t = dashboard.tiles
  return (
    <div className={styles.tiles}>
      <StatTile
        icon={<Flame />}
        label={t.streak}
        value={data.currentStreak}
        hint={data.longestStreak > 0 ? t.streakBest(data.longestStreak) : t.streakStart}
        tone="amber"
        locale={locale}
      />
      <StatTile
        icon={<Repeat />}
        label={t.due}
        value={data.dueCount}
        hint={data.dueCount > 0 ? t.dueReady : t.dueNone}
        tone="violet"
        locale={locale}
        to="/review"
      />
      <StatTile
        icon={<BookOpen />}
        label={t.words}
        value={data.totalWords}
        hint={t.wordsMastered(data.masteredWords)}
        tone="blue"
        locale={locale}
        to="/vocabulary"
      />
      <StatTile
        icon={<CalendarDays />}
        label={t.studyDays}
        value={data.totalStudyDays}
        hint={t.studyDaysHint}
        tone="teal"
        locale={locale}
      />
    </div>
  )
}

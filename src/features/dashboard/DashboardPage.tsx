import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { LevelJourney } from './components/LevelJourney'
import { QuickActions } from './components/QuickActions'
import { RecentActivity } from './components/RecentActivity'
import { StatTiles } from './components/StatTiles'
import { TodayEntry } from './components/TodayEntry'
import { TodayPlan } from './components/TodayPlan'
import { WeeklyActivity } from './components/WeeklyActivity'
import { greetingFor } from './greeting'
import { buildTodayPlan } from './todayPlan'
import { useDashboardData } from './useDashboardData'
import styles from './Dashboard.module.scss'

export default function DashboardPage() {
  const data = useDashboardData()
  const t = useT()
  // Subscribe only to the fields this page shows (not the whole settings store).
  const { displayName, currentLevel, targetLevel, dailyXpGoal } = useSettings(
    useShallow((s) => ({
      displayName: s.displayName,
      currentLevel: s.currentLevel,
      targetLevel: s.targetLevel,
      dailyXpGoal: s.dailyXpGoal,
    })),
  )

  // Captured once per visit so the header doesn't change on every re-render.
  const [now] = useState(() => new Date())
  const date = now.toLocaleDateString(t.locale, { weekday: 'long', month: 'long', day: 'numeric' })
  const greeting = `${t.dashboard.greeting[greetingFor(now)]}${displayName ? `, ${displayName}` : ''}`

  return (
    <>
      <PageHeader title={greeting} description={<span className={styles.date}>{date}</span>} />

      {!data ? (
        <div className={styles.grid}>
          <Skeleton className={styles.spanAll} height={360} />
          <Skeleton className={styles.spanAll} height={96} />
          <Skeleton height={240} />
          <Skeleton height={240} />
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.spanAll}>
            <TodayEntry
              word={data.spotlight}
              dueCount={data.dueCount}
              newWords={data.newWords}
              todayXp={data.todayXp}
              goal={dailyXpGoal}
            />
          </div>
          <div className={styles.spanAll}>
            <StatTiles data={data} />
          </div>
          <TodayPlan
            steps={buildTodayPlan({
              totalWords: data.totalWords,
              dueCount: data.dueCount,
              reviewedToday: data.reviewedToday,
              todayXp: data.todayXp,
              dailyXpGoal,
              backupDue: data.backupDue,
            })}
            context={{
              dueCount: data.dueCount,
              newWords: data.newWords,
              todayXp: data.todayXp,
              dailyXpGoal,
              backupDays: data.backupDue?.days ?? null,
            }}
          />
          <WeeklyActivity week={data.week} goal={dailyXpGoal} />
          <RecentActivity events={data.recent} />
          <div className={styles.stack}>
            <LevelJourney current={currentLevel} target={targetLevel} />
            <QuickActions />
          </div>
        </div>
      )}
    </>
  )
}

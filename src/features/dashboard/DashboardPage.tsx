import { useState } from 'react'
import { Badge, PageHeader, Skeleton } from '@/components/ui'
import { useSettings } from '@/stores/settingsStore'
import { DailyGoalCard } from './components/DailyGoalCard'
import { LevelJourney } from './components/LevelJourney'
import { QuickActions } from './components/QuickActions'
import { RecentActivity } from './components/RecentActivity'
import { StatTiles } from './components/StatTiles'
import { TodayPlan } from './components/TodayPlan'
import { WeeklyActivity } from './components/WeeklyActivity'
import { greetingFor } from './greeting'
import { buildTodayPlan } from './todayPlan'
import { useDashboardData } from './useDashboardData'
import styles from './Dashboard.module.scss'

export default function DashboardPage() {
  const data = useDashboardData()
  const { displayName, currentLevel, targetLevel, dailyXpGoal } = useSettings()

  // Captured once per visit so the header doesn't change on every re-render.
  const [now] = useState(() => new Date())
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const greeting = `${greetingFor(now)}${displayName ? `, ${displayName}` : ''}`

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            {date}
            <Badge tone="accent">{currentLevel}</Badge>
          </>
        }
        title={greeting}
        description="Small steps every day. Here’s where you are."
      />

      {!data ? (
        <div className={styles.grid}>
          <Skeleton className={styles.spanAll} height={220} />
          <Skeleton className={styles.spanAll} height={110} />
          <Skeleton height={240} />
          <Skeleton height={240} />
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.spanAll}>
            <DailyGoalCard
              todayXp={data.todayXp}
              goal={dailyXpGoal}
              dueCount={data.dueCount}
              totalWords={data.totalWords}
            />
          </div>
          <div className={styles.spanAll}>
            <StatTiles data={data} />
          </div>
          <TodayPlan
            steps={buildTodayPlan({
              totalWords: data.totalWords,
              dueCount: data.dueCount,
              todayXp: data.todayXp,
              dailyXpGoal,
            })}
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

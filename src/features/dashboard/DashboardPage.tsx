import { useState } from 'react'
import { Badge, PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
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
  const t = useT()
  const { displayName, currentLevel, targetLevel, dailyXpGoal } = useSettings()

  // Captured once per visit so the header doesn't change on every re-render.
  const [now] = useState(() => new Date())
  const date = now.toLocaleDateString(t.locale, { weekday: 'long', month: 'long', day: 'numeric' })
  const greeting = `${t.dashboard.greeting[greetingFor(now)]}${displayName ? `, ${displayName}` : ''}`

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <span className={styles.date}>{date}</span>
            <Badge tone="accent">{currentLevel}</Badge>
          </>
        }
        title={greeting}
        description={t.dashboard.subtitle}
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
              newWords={data.newWords}
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
            context={{
              dueCount: data.dueCount,
              newWords: data.newWords,
              todayXp: data.todayXp,
              dailyXpGoal,
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

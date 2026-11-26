import { CalendarDays } from 'lucide-react'
import { Card, CardHeader, PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { useNow } from '@/lib/useNow'
import { useSettings } from '@/stores/settingsStore'
import { PlanEditor } from './components/PlanEditor'
import { TodayCard } from './components/TodayCard'
import { WeekStrip } from './components/WeekStrip'
import { useWeekActivity } from './hooks'
import { weekProgress } from './week'
import styles from './Planner.module.scss'

export default function PlannerPage() {
  const p = useT().planner
  const now = useNow()
  const days = useSettings((s) => s.studyDays)
  const activity = useWeekActivity()
  const week = activity ? weekProgress(now, days, activity) : null

  return (
    <>
      <PageHeader title={p.title} description={p.subtitle} />
      <div className={styles.layout}>
        <div className={styles.main}>
          <TodayCard />
          <Card>
            <CardHeader
              icon={<CalendarDays />}
              title={p.week}
              description={week ? p.weekSummary(week.metSoFar, week.plannedSoFar) : undefined}
            />
            {week ? <WeekStrip week={week.week} /> : <Skeleton height={80} />}
          </Card>
        </div>
        <PlanEditor />
      </div>
    </>
  )
}

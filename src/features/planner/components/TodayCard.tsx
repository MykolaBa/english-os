import { useState } from 'react'
import { Coffee, ListChecks } from 'lucide-react'
import { Button, Card, CardHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { useAgenda } from '../hooks'
import { AgendaList } from './AgendaList'
import styles from '../Planner.module.scss'

/** Today's agenda — the bold block of the planner. A day off can be turned into a study day. */
export function TodayCard() {
  const p = useT().planner
  const [anyway, setAnyway] = useState(false)
  const agenda = useAgenda(anyway)
  if (!agenda) return <Skeleton height={260} />

  const planned = agenda.items.reduce((sum, i) => sum + i.minutes, 0)
  return (
    <Card className={styles.today}>
      <CardHeader
        icon={<ListChecks />}
        title={p.today}
        description={agenda.items.length > 0 ? p.todaySummary(planned, agenda.budget) : undefined}
      />
      {!agenda.studyDay ? (
        <div className={styles.rest}>
          <Coffee aria-hidden />
          <div>
            <p className={styles.restTitle}>{p.restTitle}</p>
            <p className={styles.muted}>{p.restText}</p>
            <Button size="sm" onClick={() => setAnyway(true)}>
              {p.studyAnyway}
            </Button>
          </div>
        </div>
      ) : agenda.items.length === 0 ? (
        <p className={styles.muted}>{p.empty}</p>
      ) : (
        <AgendaList items={agenda.items} />
      )}
    </Card>
  )
}

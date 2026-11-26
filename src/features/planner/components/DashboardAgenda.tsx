import { ChevronRight, Circle, ListChecks } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { useAgenda } from '../hooks'
import { AgendaList } from './AgendaList'
import styles from '../Planner.module.scss'

/**
 * The dashboard's "Today's plan": the planner's agenda, plus the backup reminder when due.
 * Lazy-loaded by the dashboard — the agenda reads all learning content, which stays off
 * the startup path.
 */
export default function DashboardAgenda({ backupDays }: { backupDays: number | null | undefined }) {
  const t = useT()
  const d = t.dashboard.plan
  const agenda = useAgenda()
  if (!agenda) return <Skeleton height={240} />
  const done = agenda.items.filter((i) => i.done).length
  return (
    <Card>
      <CardHeader
        icon={<ListChecks />}
        title={d.title}
        description={
          agenda.items.length ? d.progress(done, agenda.items.length) : t.planner.restTitle
        }
        action={
          <Link to="/planner" className={styles.cardLink}>
            {t.planner.openPlanner}
          </Link>
        }
      />
      {agenda.items.length > 0 ? (
        <AgendaList items={agenda.items} />
      ) : (
        <p className={styles.muted}>{agenda.studyDay ? t.planner.empty : t.planner.restText}</p>
      )}
      {backupDays !== undefined && (
        <Link to="/settings" className={styles.agendaItem}>
          <Circle className={styles.circle} aria-label={t.common.toDo} />
          <span className={styles.agendaText}>
            <span className={styles.agendaTitle}>{d.backupTitle}</span>
            <span className={styles.area}>{d.backupDetail(backupDays)}</span>
          </span>
          <ChevronRight className={styles.chevron} aria-hidden />
        </Link>
      )}
    </Card>
  )
}

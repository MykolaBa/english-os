import { ChevronRight, Circle, ListChecks } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import type { PlanStep } from '../todayPlan'
import styles from '../Dashboard.module.scss'

/** First steps while the vocabulary is empty. */
export function TodayPlan({ steps }: { steps: PlanStep[] }) {
  const { dashboard, common } = useT()
  const t = dashboard.plan
  const text = {
    'add-words': [t.addWordsTitle, t.addWordsDetail],
    'set-goal': [t.setGoalTitle, t.setGoalDetail],
  } as const
  return (
    <Card>
      <CardHeader icon={<ListChecks />} title={t.title} description={t.progress(0, steps.length)} />
      <ul className={styles.plan}>
        {steps.map((step) => {
          const [title, detail] = text[step.id]
          return (
            <li key={step.id}>
              <Link to={step.to} className={styles.planItem}>
                <Circle className={styles.planCircle} aria-label={common.toDo} />
                <span className={styles.planText}>
                  <span className={styles.planTitle}>{title}</span>
                  <span className={styles.planDetail}>{detail}</span>
                </span>
                <ChevronRight className={styles.planChevron} aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

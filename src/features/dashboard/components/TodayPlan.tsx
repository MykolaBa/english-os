import { CircleCheck, Circle, ListChecks, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { PlanStep } from '../todayPlan'
import styles from '../Dashboard.module.scss'

export function TodayPlan({ steps }: { steps: PlanStep[] }) {
  const done = steps.filter((s) => s.done).length
  return (
    <Card>
      <CardHeader
        icon={<ListChecks />}
        title="Today’s plan"
        description={`${done} of ${steps.length} done`}
      />
      <ul className={styles.plan}>
        {steps.map((step) => (
          <li key={step.id}>
            <Link to={step.to} className={cx(styles.planItem, step.done && styles.planDone)}>
              {step.done ? (
                <CircleCheck className={styles.planCheck} aria-label="Done" />
              ) : (
                <Circle className={styles.planCircle} aria-label="To do" />
              )}
              <span className={styles.planText}>
                <span className={styles.planTitle}>{step.title}</span>
                <span className={styles.planDetail}>{step.detail}</span>
              </span>
              <ChevronRight className={styles.planChevron} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

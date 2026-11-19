import { ChevronRight, Circle, CircleCheck, ListChecks } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT, type Dictionary } from '@/i18n'
import { cx } from '@/lib/cx'
import { estimateReviewMinutes, type PlanStep } from '../todayPlan'
import styles from '../Dashboard.module.scss'

export interface PlanContext {
  dueCount: number
  newWords: number
  todayXp: number
  dailyXpGoal: number
  backupDays: number | null
}

function stepText(step: PlanStep, ctx: PlanContext, t: Dictionary['dashboard']['plan']) {
  switch (step.id) {
    case 'add-words':
      return [t.addWordsTitle, t.addWordsDetail]
    case 'set-goal':
      return [t.setGoalTitle, t.setGoalDetail]
    case 'review':
      return step.done
        ? [t.reviewDoneTitle, t.reviewDoneDetail]
        : [t.reviewTitle(ctx.dueCount), t.reviewDetail(estimateReviewMinutes(ctx.dueCount))]
    case 'new-words':
      return [t.newWordsTitle, t.newWordsDetail(ctx.newWords)]
    case 'backup':
      return [t.backupTitle, t.backupDetail(ctx.backupDays)]
    case 'goal':
      return [
        t.goalTitle(ctx.dailyXpGoal),
        t.goalDetail(Math.min(ctx.todayXp, ctx.dailyXpGoal), ctx.dailyXpGoal),
      ]
  }
}

export function TodayPlan({ steps, context }: { steps: PlanStep[]; context: PlanContext }) {
  const { dashboard, common } = useT()
  const t = dashboard.plan
  const done = steps.filter((s) => s.done).length
  return (
    <Card>
      <CardHeader
        icon={<ListChecks />}
        title={t.title}
        description={t.progress(done, steps.length)}
      />
      <ul className={styles.plan}>
        {steps.map((step) => {
          const [title, detail] = stepText(step, context, t)
          return (
            <li key={step.id}>
              <Link to={step.to} className={cx(styles.planItem, step.done && styles.planDone)}>
                {step.done ? (
                  <CircleCheck className={styles.planCheck} aria-label={common.done} />
                ) : (
                  <Circle className={styles.planCircle} aria-label={common.toDo} />
                )}
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

import { ArrowRight, Plus, Repeat } from 'lucide-react'
import { ButtonLink, Card, ProgressRing } from '@/components/ui'
import { useT } from '@/i18n'
import styles from '../Dashboard.module.scss'

interface DailyGoalCardProps {
  todayXp: number
  goal: number
  dueCount: number
  newWords: number
  totalWords: number
}

export function DailyGoalCard({
  todayXp,
  goal,
  dueCount,
  newWords,
  totalWords,
}: DailyGoalCardProps) {
  const t = useT().dashboard.goal
  const reached = todayXp >= goal

  const [headline, sub] =
    totalWords === 0
      ? [t.emptyTitle, t.emptyText]
      : reached
        ? [t.reachedTitle, t.reachedText]
        : [
            dueCount > 0
              ? t.dueTitle(dueCount)
              : newWords > 0
                ? t.newTitle(newWords)
                : t.keepGoingTitle,
            t.remainingText(goal - todayXp),
          ]

  return (
    <Card className={styles.goalCard} padding="lg">
      <div className={styles.goalGlow} aria-hidden />
      <ProgressRing
        value={goal > 0 ? todayXp / goal : 0}
        label={t.ringLabel}
        size={132}
        stroke={11}
      >
        <div>
          <div className={styles.ringValue}>{todayXp}</div>
          <div className={styles.ringLabel}>{t.ofXp(goal)}</div>
        </div>
      </ProgressRing>
      <div className={styles.goalText}>
        <p className={styles.kicker}>{t.kicker}</p>
        <h2 className={styles.goalHeadline}>{headline}</h2>
        <p className={styles.goalSub}>{sub}</p>
        <div className={styles.goalActions}>
          {totalWords === 0 ? (
            <ButtonLink to="/vocabulary" variant="primary" size="lg" icon={<Plus />}>
              {t.addWords}
            </ButtonLink>
          ) : (
            <ButtonLink to="/review" variant="primary" size="lg" icon={<Repeat />}>
              {dueCount > 0 ? t.startReview : t.practice}
            </ButtonLink>
          )}
          <ButtonLink to="/grammar" variant="ghost" size="lg">
            {t.grammar} <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}

import { ArrowRight, Plus, Repeat } from 'lucide-react'
import { ButtonLink, Card, ProgressRing } from '@/components/ui'
import styles from '../Dashboard.module.scss'

interface DailyGoalCardProps {
  todayXp: number
  goal: number
  dueCount: number
  totalWords: number
}

export function DailyGoalCard({ todayXp, goal, dueCount, totalWords }: DailyGoalCardProps) {
  const progress = goal > 0 ? todayXp / goal : 0
  const reached = todayXp >= goal

  const headline =
    totalWords === 0
      ? 'Let’s build your vocabulary'
      : reached
        ? 'Daily goal reached'
        : dueCount > 0
          ? `${dueCount} ${dueCount === 1 ? 'word is' : 'words are'} waiting for review`
          : 'Keep the momentum going'

  const sub =
    totalWords === 0
      ? 'Add a few words you want to remember. EnglishOS will schedule reviews so they stick.'
      : reached
        ? 'Great consistency. Anything extra today is a bonus — don’t burn out.'
        : `Earn ${goal - todayXp} more XP today. One review session is usually enough.`

  return (
    <Card className={styles.goalCard} padding="lg">
      <div className={styles.goalGlow} aria-hidden />
      <ProgressRing value={progress} label="Daily goal progress" size={132} stroke={11}>
        <div>
          <div className={styles.ringValue}>{todayXp}</div>
          <div className={styles.ringLabel}>of {goal} XP</div>
        </div>
      </ProgressRing>
      <div className={styles.goalText}>
        <p className={styles.kicker}>Today’s goal</p>
        <h2 className={styles.goalHeadline}>{headline}</h2>
        <p className={styles.goalSub}>{sub}</p>
        <div className={styles.goalActions}>
          {totalWords === 0 ? (
            <ButtonLink to="/vocabulary" variant="primary" size="lg" icon={<Plus />}>
              Add words
            </ButtonLink>
          ) : (
            <ButtonLink to="/review" variant="primary" size="lg" icon={<Repeat />}>
              {dueCount > 0 ? 'Start review' : 'Practice'}
            </ButtonLink>
          )}
          <ButtonLink to="/grammar" variant="ghost" size="lg">
            Grammar <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}

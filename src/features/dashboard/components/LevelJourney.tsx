import { Mountain } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { cx } from '@/lib/cx'
import type { CefrLevel } from '@/lib/db/types'
import styles from '../Dashboard.module.scss'

const JOURNEY: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export function LevelJourney({ current, target }: { current: CefrLevel; target: CefrLevel }) {
  const currentIdx = JOURNEY.indexOf(current)
  const targetIdx = JOURNEY.indexOf(target)

  return (
    <Card>
      <CardHeader
        icon={<Mountain />}
        title="Level journey"
        description={`${current} → ${target}`}
        action={
          <Link to="/settings" className={styles.subtleLink}>
            Edit
          </Link>
        }
      />
      <ol className={styles.journey}>
        {JOURNEY.map((level, i) => (
          <li
            key={level}
            className={cx(
              styles.journeyStep,
              i < currentIdx && styles.journeyPassed,
              i === currentIdx && styles.journeyCurrent,
              i === targetIdx && styles.journeyTarget,
            )}
            aria-current={i === currentIdx ? 'step' : undefined}
          >
            <span className={styles.journeyDot}>{level}</span>
            <span className={styles.journeyCaption}>
              {i === currentIdx ? 'You' : i === targetIdx ? 'Goal' : ''}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

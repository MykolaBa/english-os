import { Mountain } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { CefrLevel } from '@/lib/db/types'
import styles from '../Dashboard.module.scss'

const JOURNEY: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export function LevelJourney({ current, target }: { current: CefrLevel; target: CefrLevel }) {
  const { dashboard, common } = useT()
  const t = dashboard.journey
  const currentIdx = JOURNEY.indexOf(current)
  const targetIdx = JOURNEY.indexOf(target)

  return (
    <Card>
      <CardHeader
        icon={<Mountain />}
        title={t.title}
        description={t.range(current, target)}
        action={
          <Link to="/settings" className={styles.subtleLink}>
            {common.edit}
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
              {i === currentIdx ? t.you : i === targetIdx ? t.goal : ''}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

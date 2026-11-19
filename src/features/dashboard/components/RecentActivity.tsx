import { History, Sparkles } from 'lucide-react'
import { Badge, Card, CardHeader, EmptyState } from '@/components/ui'
import type { ActivityEvent } from '@/lib/db/types'
import { formatRelative } from '@/lib/date'
import styles from '../Dashboard.module.scss'

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  return (
    <Card>
      <CardHeader icon={<History />} title="Recent activity" />
      {events.length === 0 ? (
        <EmptyState
          compact
          icon={<Sparkles />}
          title="No activity yet"
          description="Everything you learn will show up here — words added, reviews, lessons."
        />
      ) : (
        <ul className={styles.feed}>
          {events.map((e) => (
            <li key={e.id} className={styles.feedItem}>
              <span className={styles.feedLabel}>{e.label}</span>
              <span className={styles.feedMeta}>
                {e.xp > 0 && <Badge tone="accent">+{e.xp} XP</Badge>}
                <time dateTime={new Date(e.at).toISOString()}>{formatRelative(e.at)}</time>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

import { History, Sparkles } from 'lucide-react'
import { Badge, Card, CardHeader, EmptyState } from '@/components/ui'
import { useT } from '@/i18n'
import type { ActivityEvent } from '@/lib/db/types'
import { formatRelative } from '@/lib/date'
import styles from '../Dashboard.module.scss'

export function RecentActivity({ events }: { events: ActivityEvent[] }) {
  const { locale, dashboard, common } = useT()
  return (
    <Card>
      <CardHeader icon={<History />} title={dashboard.recent.title} />
      {events.length === 0 ? (
        <EmptyState
          compact
          icon={<Sparkles />}
          title={dashboard.recent.emptyTitle}
          description={dashboard.recent.emptyText}
        />
      ) : (
        <ul className={styles.feed}>
          {events.map((e) => (
            <li key={e.id} className={styles.feedItem}>
              <span className={styles.feedLabel}>{e.label}</span>
              <span className={styles.feedMeta}>
                {e.xp > 0 && <Badge tone="accent">+{e.xp} XP</Badge>}
                <time dateTime={new Date(e.at).toISOString()}>
                  {formatRelative(e.at, locale, common.justNow)}
                </time>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

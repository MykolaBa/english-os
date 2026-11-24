import { BookOpen, PieChart } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import type { WordStatus } from '@/lib/db/types'
import type { AreaXp } from '../stats'
import { BarList } from './BarList'
import styles from '../Statistics.module.scss'

export function AreasCard({ areas }: { areas: AreaXp[] }) {
  const { locale, statistics: s } = useT()
  return (
    <Card>
      <CardHeader icon={<PieChart />} title={s.areas.title} description={s.areas.description} />
      {areas.length === 0 ? (
        <p className={styles.chartEmpty}>{s.xp.empty}</p>
      ) : (
        <BarList
          label={s.areas.title}
          items={areas.map((a) => ({
            key: a.area,
            label: s.areas.items[a.area],
            value: a.xp,
            display: s.xpValue(a.xp.toLocaleString(locale)),
          }))}
        />
      )}
    </Card>
  )
}

/** A snapshot of the whole dictionary, in learning order: new → mastered. */
export function VocabularyCard({
  statuses,
}: {
  statuses: { status: WordStatus; count: number }[]
}) {
  const t = useT()
  const s = t.statistics.vocabulary
  const total = statuses.reduce((sum, x) => sum + x.count, 0)
  return (
    <Card>
      <CardHeader icon={<BookOpen />} title={s.title} description={s.description(total)} />
      {total === 0 ? (
        <p className={styles.chartEmpty}>{s.empty}</p>
      ) : (
        <BarList
          label={s.title}
          items={statuses.map((x) => ({
            key: x.status,
            label: t.status[x.status],
            value: x.count,
            display: x.count.toLocaleString(t.locale),
          }))}
        />
      )}
    </Card>
  )
}

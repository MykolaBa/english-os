import { useState } from 'react'
import { ChartNoAxesColumn } from 'lucide-react'
import { ButtonLink, EmptyState, PageHeader, Segmented, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { AccuracyChart } from './components/AccuracyChart'
import { AreasCard, VocabularyCard } from './components/Breakdowns'
import { PeriodSummary } from './components/PeriodSummary'
import { WeakSpots } from './components/WeakSpots'
import { XpChart } from './components/XpChart'
import { STAT_PERIODS, periodLength, type StatPeriod } from './stats'
import { useStatistics } from './useStatistics'
import styles from './Statistics.module.scss'

export default function StatisticsPage() {
  const t = useT()
  const s = t.statistics
  const [period, setPeriod] = useState<StatPeriod>('month')
  const data = useStatistics(period)

  const header = (
    <PageHeader
      title={s.title}
      description={s.subtitle}
      actions={
        data && !data.empty ? (
          <Segmented<StatPeriod>
            label={s.period}
            value={period}
            options={STAT_PERIODS.map((p) => ({ value: p, label: s.periods[p] }))}
            onChange={setPeriod}
          />
        ) : null
      }
    />
  )

  if (!data) {
    return (
      <>
        {header}
        <Skeleton height={480} />
      </>
    )
  }

  if (data.empty) {
    return (
      <>
        {header}
        <EmptyState
          icon={<ChartNoAxesColumn />}
          title={s.emptyTitle}
          description={s.emptyText}
          action={
            <ButtonLink to="/review" variant="primary">
              {s.emptyAction}
            </ButtonLink>
          }
        />
      </>
    )
  }

  return (
    <>
      {header}
      <div className={styles.layout}>
        <PeriodSummary summary={data.summary} days={periodLength(period)} />
        <XpChart buckets={data.buckets} period={period} total={data.summary.xp} />
        <div className={styles.grid}>
          <AccuracyChart buckets={data.buckets} period={period} />
          <AreasCard areas={data.areas} />
          <VocabularyCard statuses={data.statuses} />
          <WeakSpots missed={data.missed} lessons={data.weakLessons} />
        </div>
      </div>
    </>
  )
}

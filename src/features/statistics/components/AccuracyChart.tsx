import { Target } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ButtonLink, Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { bucketTitle, tickLabel } from '../format'
import type { Bucket, StatPeriod } from '../stats'
import { ChartTable } from './ChartTable'
import { ChartTooltip } from './ChartTooltip'
import { CHART_HEIGHT, Y_AXIS_WIDTH, axisProps, gridProps } from './chartTheme'
import styles from '../Statistics.module.scss'

/** Markers: 8px with a 2px ring in the surface color, so they read on top of the line. */
const dot = { r: 4, strokeWidth: 2, stroke: 'var(--surface)', fill: 'var(--accent)' }

/**
 * Share of remembered answers. Days without reviews are gaps (null), not 0% —
 * a day off is not a day of forgetting everything.
 */
export function AccuracyChart({ buckets, period }: { buckets: Bucket[]; period: StatPeriod }) {
  const t = useT()
  const s = t.statistics
  const byStart = new Map(buckets.map((b) => [b.start, b]))
  const title = (b: Bucket) => bucketTitle(b, period, t.locale, s.weekOf)
  const hasData = buckets.some((b) => b.answers > 0)

  return (
    <Card>
      <CardHeader icon={<Target />} title={s.accuracy.title} description={s.accuracy.description} />
      {!hasData ? (
        <div className={styles.chartEmpty}>
          <p>{s.accuracy.empty}</p>
          <ButtonLink to="/review" variant="secondary" size="sm">
            {s.emptyAction}
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <LineChart
                data={buckets}
                title={s.accuracy.title}
                margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="start"
                  {...axisProps}
                  tickFormatter={(start: string) => tickLabel(start, period, t.locale)}
                  minTickGap={12}
                />
                <YAxis
                  {...axisProps}
                  width={Y_AXIS_WIDTH}
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(n: number) => `${n}%`}
                />
                <Tooltip
                  cursor={{ stroke: 'var(--border-strong)' }}
                  isAnimationActive={false}
                  content={({ active, label }) => {
                    const b = active ? byStart.get(String(label)) : undefined
                    return b ? (
                      <ChartTooltip title={title(b)}>
                        <p className={styles.tooltipValue}>
                          {b.accuracy === null ? s.table.none : `${b.accuracy}%`}
                        </p>
                        {b.answers > 0 && <p>{s.accuracy.tooltip(b.correct, b.answers)}</p>}
                      </ChartTooltip>
                    ) : null
                  }}
                />
                <Line
                  dataKey="accuracy"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={dot}
                  activeDot={{ ...dot, r: 5 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ChartTable
            columns={[s.table.period, s.table.answers, s.table.correct, s.table.accuracy]}
            rows={buckets.map((b) => ({
              key: b.start,
              cells: [
                title(b),
                b.answers,
                b.correct,
                b.accuracy === null ? s.table.none : `${b.accuracy}%`,
              ],
            }))}
          />
        </>
      )}
    </Card>
  )
}

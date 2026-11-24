import { ChartNoAxesColumn } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { bucketTitle, tickLabel } from '../format'
import { isWeekly, type Bucket, type StatPeriod } from '../stats'
import { ChartTable } from './ChartTable'
import { ChartTooltip } from './ChartTooltip'
import { CHART_HEIGHT, Y_AXIS_WIDTH, axisProps, gridProps } from './chartTheme'
import styles from '../Statistics.module.scss'

interface XpChartProps {
  buckets: Bucket[]
  period: StatPeriod
  total: number
}

/** XP per day (or per week for three months). One series, so the title names it — no legend. */
export function XpChart({ buckets, period, total }: XpChartProps) {
  const { locale, statistics: s } = useT()
  const byStart = new Map(buckets.map((b) => [b.start, b]))
  const title = (b: Bucket) => bucketTitle(b, period, locale, s.weekOf)
  const heading = isWeekly(period) ? s.xp.titleWeekly : s.xp.titleDaily

  return (
    <Card className={styles.hero}>
      <CardHeader
        icon={<ChartNoAxesColumn />}
        title={heading}
        description={s.xp.description(total)}
      />
      {total === 0 ? (
        <p className={styles.chartEmpty}>{s.xp.empty}</p>
      ) : (
        <>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
              <BarChart
                data={buckets}
                title={heading}
                margin={{ top: 8, right: 4, bottom: 0, left: 0 }}
              >
                <CartesianGrid {...gridProps} />
                <XAxis
                  dataKey="start"
                  {...axisProps}
                  tickFormatter={(start: string) => tickLabel(start, period, locale)}
                  minTickGap={12}
                />
                <YAxis {...axisProps} width={Y_AXIS_WIDTH} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'var(--surface-hover)', stroke: 'none' }}
                  isAnimationActive={false}
                  content={({ active, label }) => {
                    const b = active ? byStart.get(String(label)) : undefined
                    return b ? (
                      <ChartTooltip title={title(b)}>
                        <p className={styles.tooltipValue}>
                          {s.xpValue(b.xp.toLocaleString(locale))}
                        </p>
                      </ChartTooltip>
                    ) : null
                  }}
                />
                <Bar
                  dataKey="xp"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ChartTable
            columns={[s.table.period, s.table.xp]}
            rows={buckets.map((b) => ({ key: b.start, cells: [title(b), b.xp] }))}
          />
        </>
      )}
    </Card>
  )
}

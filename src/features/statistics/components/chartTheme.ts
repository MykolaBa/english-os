/**
 * Shared Recharts styling. Colors are CSS variables, so charts follow the light/dark
 * theme without re-rendering. Axes and grid stay recessive; the data carries the color.
 */
export const CHART_HEIGHT = 220

export const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: 'var(--text-muted)', fontSize: 12 },
} as const

export const gridProps = {
  vertical: false,
  stroke: 'var(--border)',
} as const

/** Room for the y-axis labels ("100%"). */
export const Y_AXIS_WIDTH = 40

import { useId, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Progress.module.scss'

const clamp = (v: number) => Math.min(1, Math.max(0, v))

interface ProgressBarProps {
  /** 0..1 */
  value: number
  label: string
  tone?: 'brand' | 'success' | 'warning'
  size?: 'sm' | 'md'
  className?: string
}

export function ProgressBar({
  value,
  label,
  tone = 'brand',
  size = 'md',
  className,
}: ProgressBarProps) {
  const pct = Math.round(clamp(value) * 100)
  return (
    <div
      className={cx(styles.track, styles[size], className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cx(styles.fill, styles[tone])} style={{ width: `${pct}%` }} />
    </div>
  )
}

interface ProgressRingProps {
  value: number
  label: string
  size?: number
  stroke?: number
  children?: ReactNode
}

export function ProgressRing({
  value,
  label,
  size = 120,
  stroke = 10,
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = clamp(value)
  const gradientId = useId()
  return (
    <div
      className={styles.ring}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--violet)" />
            <stop offset="55%" stopColor="var(--blue)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
        <circle
          className={styles.ringTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className={styles.ringFill}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      {children && <div className={styles.ringContent}>{children}</div>}
    </div>
  )
}

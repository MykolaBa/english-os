import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './EmptyState.module.scss'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  /** The heading level; `h1` when the empty state is the whole page (404, missing item). */
  headingAs?: 'h1' | 'h2' | 'h3'
  description?: ReactNode
  action?: ReactNode
  compact?: boolean
  className?: string
}

export function EmptyState({
  icon,
  title,
  headingAs: Heading = 'h3',
  description,
  action,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, compact && styles.compact, className)}>
      <div className={styles.icon}>{icon}</div>
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

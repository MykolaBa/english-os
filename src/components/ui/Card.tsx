import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Card.module.scss'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export function Card({
  as: Tag = 'section',
  padding = 'md',
  interactive,
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cx(
        styles.card,
        styles[`pad-${padding}`],
        interactive && styles.interactive,
        className,
      )}
      {...rest}
    />
  )
}

interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}

export function CardHeader({ title, description, icon, action }: CardHeaderProps) {
  return (
    <header className={styles.header}>
      {icon && <span className={styles.headerIcon}>{icon}</span>}
      <div className={styles.headerText}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  )
}

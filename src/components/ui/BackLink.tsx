import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { cx } from '@/lib/cx'
import styles from './BackLink.module.scss'

/** "← All texts": the way back from a detail page to its list. */
export function BackLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link to={to} className={cx(styles.backLink, className)}>
      <ArrowLeft aria-hidden /> {children}
    </Link>
  )
}

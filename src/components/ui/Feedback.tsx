import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { cx } from '@/lib/cx'
import { useT } from '@/i18n'
import { Button } from './Button'
import { EmptyState } from './EmptyState'
import styles from './Feedback.module.scss'

export function Spinner({ label }: { label?: string }) {
  const t = useT()
  return <span className={styles.spinner} role="status" aria-label={label ?? t.common.loading} />
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <Spinner />
    </div>
  )
}

export function Skeleton({ className, height }: { className?: string; height?: number | string }) {
  return <div className={cx(styles.skeleton, className)} style={{ height }} aria-hidden />
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const t = useT()
  return (
    <EmptyState
      icon={<TriangleAlert />}
      title={t.errors.title}
      description={message ?? t.errors.description}
      action={onRetry && <Button onClick={onRetry}>{t.common.tryAgain}</Button>}
    />
  )
}

interface ErrorBoundaryState {
  error: Error | null
}

/** Catches render errors in a page so one broken module doesn't take down the whole app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[EnglishOS] Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          message={this.state.error.message}
          onRetry={() => this.setState({ error: null })}
        />
      )
    }
    return this.props.children
  }
}

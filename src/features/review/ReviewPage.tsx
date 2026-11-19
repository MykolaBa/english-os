import { useCallback, useState } from 'react'
import { PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import type { ReviewMode } from '@/stores/settingsStore'
import { ReviewOverview } from './components/ReviewOverview'
import { ReviewSession } from './components/ReviewSession'
import { SessionSummary } from './components/SessionSummary'
import { useReviewData } from './hooks'
import type { SessionState } from './session'

type Screen =
  | { name: 'overview' }
  | { name: 'session'; words: Word[]; mode: ReviewMode }
  | { name: 'summary'; state: SessionState; finishedAt: number }

/** Overview → session → summary. A discriminated union makes impossible screens unrepresentable. */
export default function ReviewPage() {
  const t = useT()
  const data = useReviewData()
  const [screen, setScreen] = useState<Screen>({ name: 'overview' })

  const finish = useCallback((state: SessionState) => {
    setScreen(
      state.answers.length > 0
        ? { name: 'summary', state, finishedAt: Date.now() }
        : { name: 'overview' },
    )
  }, [])

  if (screen.name === 'session') {
    return <ReviewSession words={screen.words} mode={screen.mode} onFinish={finish} />
  }

  return (
    <>
      <PageHeader title={t.review.title} />
      {screen.name === 'summary' ? (
        <SessionSummary
          state={screen.state}
          finishedAt={screen.finishedAt}
          onBack={() => setScreen({ name: 'overview' })}
        />
      ) : !data ? (
        <Skeleton height={320} />
      ) : (
        <ReviewOverview
          data={data}
          onStart={(words, mode) => setScreen({ name: 'session', words, mode })}
        />
      )}
    </>
  )
}

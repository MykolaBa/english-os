import { ListChecks } from 'lucide-react'
import type { ReadingText } from '@/content/reading'
import { useT } from '@/i18n'
import type { ReadingProgress } from '@/lib/db/types'
import { PracticeSection } from '@/features/exercises/PracticeSection'
import { recordReading } from '../readingRepo'

/** Comprehension questions on the shared exercise engine; finishing them marks the text read. */
export function ComprehensionPanel({
  text,
  progress,
}: {
  text: ReadingText
  progress: ReadingProgress | null
}) {
  const r = useT().reading
  return (
    <PracticeSection
      title={r.check}
      intro={
        <>
          <p>{r.checkText(text.questions.length)}</p>
          {progress?.lastScore !== undefined && progress.bestScore !== undefined && (
            <p>{r.lastResult(progress.lastScore, progress.bestScore)}</p>
          )}
        </>
      }
      startLabel={r.checkStart}
      startIcon={<ListChecks />}
      build={() => text.questions}
      onComplete={(result) => recordReading(text.id, text.title, result)}
    />
  )
}

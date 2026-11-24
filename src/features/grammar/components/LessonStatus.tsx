import { Badge } from '@/components/ui'
import { useT } from '@/i18n'
import type { LessonProgress } from '@/lib/db/types'

/** Nothing for untouched lessons; "In progress" or "Completed (best 88%)" otherwise. */
export function LessonStatus({ progress }: { progress: LessonProgress | undefined | null }) {
  const t = useT().grammar
  if (!progress) return null
  const best = progress.bestScore !== undefined ? ` (${t.bestScore(progress.bestScore)})` : ''
  return progress.status === 'completed' ? (
    <Badge tone="success">
      {t.status.completed}
      {best}
    </Badge>
  ) : (
    <Badge tone="warning">{t.status.inProgress}</Badge>
  )
}

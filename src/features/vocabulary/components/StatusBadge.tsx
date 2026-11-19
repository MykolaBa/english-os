import { Badge, type BadgeTone } from '@/components/ui'
import { useT } from '@/i18n'
import type { WordStatus } from '@/lib/db/types'

const TONES: Record<WordStatus, BadgeTone> = {
  new: 'info',
  learning: 'warning',
  reviewing: 'accent',
  mastered: 'success',
}

export function StatusBadge({ status }: { status: WordStatus }) {
  const t = useT()
  return <Badge tone={TONES[status]}>{t.status[status]}</Badge>
}

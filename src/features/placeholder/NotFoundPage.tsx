import { Compass } from 'lucide-react'
import { ButtonLink, Card, EmptyState } from '@/components/ui'
import { useT } from '@/i18n'

export default function NotFoundPage() {
  const t = useT().errors
  return (
    <Card padding="lg">
      <EmptyState
        icon={<Compass />}
        title={t.notFoundTitle}
        description={t.notFoundDescription}
        action={<ButtonLink to="/">{t.goToDashboard}</ButtonLink>}
      />
    </Card>
  )
}

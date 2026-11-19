import { Compass } from 'lucide-react'
import { ButtonLink, Card, EmptyState } from '@/components/ui'

export default function NotFoundPage() {
  return (
    <Card padding="lg">
      <EmptyState
        icon={<Compass />}
        title="Page not found"
        description="This page doesn’t exist. Maybe it moved, or the link is outdated."
        action={<ButtonLink to="/">Go to dashboard</ButtonLink>}
      />
    </Card>
  )
}

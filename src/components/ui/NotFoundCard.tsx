import { SearchX } from 'lucide-react'
import { Card } from './Card'
import { EmptyState } from './EmptyState'

/** A detail page whose item doesn't exist (renamed content, deleted word, typo in the URL). */
export function NotFoundCard({ title, description }: { title: string; description: string }) {
  return (
    <Card padding="lg">
      <EmptyState icon={<SearchX />} title={title} description={description} />
    </Card>
  )
}

import { SearchX } from 'lucide-react'
import { Card } from './Card'
import { EmptyState } from './EmptyState'

/**
 * A detail page whose item doesn't exist (renamed content, deleted word, typo in the URL).
 * Its title is the page's only heading, so it's an h1.
 */
export function NotFoundCard({ title, description }: { title: string; description: string }) {
  return (
    <Card padding="lg">
      <EmptyState headingAs="h1" icon={<SearchX />} title={title} description={description} />
    </Card>
  )
}

import { ArrowLeft, Hammer } from 'lucide-react'
import { ButtonLink, Card, EmptyState, PageHeader } from '@/components/ui'
import type { NavItem } from '@/app/navigation'

/** Temporary page for modules that are on the roadmap but not built yet. */
export default function ComingSoonPage({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <>
      <PageHeader title={item.label} description={item.summary} />
      <Card padding="lg">
        <EmptyState
          icon={<Icon />}
          title={`${item.label} is on the roadmap`}
          description={
            <>
              <Hammer size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Planned for
              phase {item.phase}. The foundation is ready — this module will plug into the same data
              layer.
            </>
          }
          action={
            <ButtonLink to="/" icon={<ArrowLeft />}>
              Back to dashboard
            </ButtonLink>
          }
        />
      </Card>
    </>
  )
}

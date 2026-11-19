import { ArrowLeft } from 'lucide-react'
import { ButtonLink, Card, EmptyState, PageHeader } from '@/components/ui'
import type { NavItem } from '@/app/navigation'
import { useT } from '@/i18n'

/** Temporary page for modules that are on the roadmap but not built yet. */
export default function ComingSoonPage({ item }: { item: NavItem }) {
  const t = useT()
  const { label, summary } = t.nav.items[item.id]
  const Icon = item.icon
  return (
    <>
      <PageHeader title={label} description={summary} />
      <Card padding="lg">
        <EmptyState
          icon={<Icon />}
          title={t.placeholder.title(label)}
          description={t.placeholder.description(item.phase)}
          action={
            <ButtonLink to="/" icon={<ArrowLeft />}>
              {t.placeholder.back}
            </ButtonLink>
          }
        />
      </Card>
    </>
  )
}

import { FolderPlus, Layers, Trash2 } from 'lucide-react'
import { Button, Chip } from '@/components/ui'
import { useT } from '@/i18n'
import type { Collection } from '@/lib/db/types'
import { CollectionIcon } from './CollectionIcon'
import styles from '../Vocabulary.module.scss'

interface CollectionBarProps {
  collections: Collection[]
  counts: Map<string, number>
  total: number
  selectedId: string | null
  onSelect: (id: string | null) => void
  onCreate: () => void
  onDelete: (collection: Collection) => void
}

export function CollectionBar({
  collections,
  counts,
  total,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: CollectionBarProps) {
  const { vocabulary: t, common } = useT()
  const selected = collections.find((c) => c.id === selectedId)

  return (
    <section className={styles.collections} aria-label={t.collections.title}>
      <div className={styles.chipScroller}>
        <Chip selected={!selectedId} icon={<Layers />} count={total} onClick={() => onSelect(null)}>
          {t.filters.allCollections}
        </Chip>
        {collections.map((c) => (
          <Chip
            key={c.id}
            selected={c.id === selectedId}
            icon={<CollectionIcon name={c.icon} />}
            count={counts.get(c.id) ?? 0}
            onClick={() => onSelect(c.id === selectedId ? null : c.id)}
            title={c.description}
          >
            {c.name}
          </Chip>
        ))}
        <Chip selected={false} icon={<FolderPlus />} onClick={onCreate}>
          {t.collections.new}
        </Chip>
      </div>
      {selected?.source === 'user' && (
        <Button variant="ghost" size="sm" icon={<Trash2 />} onClick={() => onDelete(selected)}>
          {common.delete}
        </Button>
      )}
    </section>
  )
}

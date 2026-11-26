import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button, Segmented } from '@/components/ui'
import { useT } from '@/i18n'
import { LIBRARY_STATUSES, type LibraryItem, type LibraryStatus } from '@/lib/db/types'
import { safeUrl } from '../text'
import styles from '../Library.module.scss'

interface Props {
  item: LibraryItem
  onStatus: (status: LibraryStatus) => void
  onEdit: () => void
  onDelete: () => void
}

export function ItemHeader({ item, onStatus, onEdit, onDelete }: Props) {
  const l = useT().library
  // Checked again at render: only http(s) is ever turned into a link.
  const url = item.url ? safeUrl(item.url) : null
  return (
    <header className={styles.hero}>
      <h1 className={styles.heroTitle} lang="en">
        {item.title}
      </h1>
      {item.tags.length > 0 && (
        <p className={styles.tags}>
          {item.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      )}
      <div className={styles.heroActions}>
        <Segmented<LibraryStatus>
          label={l.status}
          value={item.status}
          options={LIBRARY_STATUSES.map((s) => ({ value: s, label: l.statuses[s] }))}
          onChange={onStatus}
        />
        <div className={styles.buttons}>
          {url && (
            <a className={styles.external} href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden /> {l.openLink}
            </a>
          )}
          <Button size="sm" icon={<Pencil />} onClick={onEdit}>
            {l.edit}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            iconOnly
            icon={<Trash2 />}
            aria-label={l.delete}
            onClick={onDelete}
          />
        </div>
      </div>
    </header>
  )
}

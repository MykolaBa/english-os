import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BackLink, ConfirmDialog, NotFoundCard, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import type { LibraryItem, LibraryStatus } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { useCollections, useVocabularyIndex } from '@/features/vocabulary/hooks'
import type { WordDraft } from '@/features/vocabulary/model'
import { WordFormDialog } from '@/features/vocabulary/components/WordFormDialog'
import { ItemHeader } from './components/ItemHeader'
import { ItemReader } from './components/ItemReader'
import { LibraryItemDialog } from './components/LibraryItemDialog'
import { TextStats } from './components/TextStats'
import { useLibraryItem } from './hooks'
import { deleteLibraryItem, setLibraryStatus } from './libraryRepo'
import styles from './Library.module.scss'

export default function LibraryItemPage() {
  const { itemId } = useParams()
  const item = useLibraryItem(itemId)
  const l = useT().library
  return (
    <div className={styles.page}>
      <BackLink to="/library">{l.back}</BackLink>
      {item === undefined ? (
        <Skeleton height={400} />
      ) : item === null ? (
        <NotFoundCard title={l.notFoundTitle} description={l.notFoundText} />
      ) : (
        <ItemView key={item.id} item={item} />
      )}
    </div>
  )
}

function ItemView({ item }: { item: LibraryItem }) {
  const t = useT()
  const l = t.library
  const navigate = useNavigate()
  const vocabulary = useVocabularyIndex()
  const collections = useCollections()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [adding, setAdding] = useState<{ key: string; draft: Partial<WordDraft> } | null>(null)
  const fail = (err: unknown) => toast.error(t.errors.title, String(err))

  const onStatus = (status: LibraryStatus) =>
    void setLibraryStatus(item.id, status)
      .then((xp) => xp > 0 && toast.success(l.doneToast(xp)))
      .catch(fail)

  return (
    <>
      <ItemHeader
        item={item}
        onStatus={onStatus}
        onEdit={() => setEditing(true)}
        onDelete={() => setConfirmDelete(true)}
      />
      {item.notes && (
        <p className={styles.notes}>
          <strong>{l.notes}: </strong>
          {item.notes}
        </p>
      )}
      {!item.text ? (
        <p className={styles.muted}>{l.linkOnly}</p>
      ) : !vocabulary ? (
        <Skeleton height={300} />
      ) : (
        <>
          <TextStats
            text={item.text}
            vocabulary={vocabulary}
            onAdd={(u) => setAdding({ key: u.word, draft: { term: u.word, example: u.sentence } })}
          />
          <ItemReader
            text={item.text}
            vocabulary={vocabulary}
            onAdd={(draft, key) => setAdding({ key, draft })}
          />
        </>
      )}
      {editing && <LibraryItemDialog item={item} onClose={() => setEditing(false)} />}
      {adding && collections && (
        <WordFormDialog
          key={adding.key}
          open
          onClose={() => setAdding(null)}
          collections={collections}
          initial={adding.draft}
        />
      )}
      <ConfirmDialog
        open={confirmDelete}
        title={l.deleteTitle}
        description={l.deleteText}
        confirmLabel={l.delete}
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteLibraryItem(item.id)
          toast.success(l.deleted)
          navigate('/library', { replace: true })
        }}
      />
    </>
  )
}

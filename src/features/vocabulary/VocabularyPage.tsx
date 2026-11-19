import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { BookOpen, Download, Plus, SearchX, Upload } from 'lucide-react'
import { Button, Card, ConfirmDialog, EmptyState, PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import type { Collection } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { CollectionBar } from './components/CollectionBar'
import { CollectionFormDialog } from './components/CollectionFormDialog'
import { ExportDialog } from './components/ExportDialog'
import { ImportDialog } from './components/ImportDialog'
import { VocabularyToolbar } from './components/VocabularyToolbar'
import { WordEntry } from './components/WordEntry'
import { WordFormDialog } from './components/WordFormDialog'
import { filterWords, sortWords } from './filters'
import { useCollections, useWords } from './hooks'
import { useWordFilters } from './useWordFilters'
import { deleteCollection } from './wordsRepo'
import styles from './Vocabulary.module.scss'

export default function VocabularyPage() {
  const t = useT()
  const v = t.vocabulary
  const words = useWords()
  const collections = useCollections()
  const { filters, update, clear, params, setParams } = useWordFilters()

  // Quick action from the dashboard opens the form right away: /vocabulary?add=1
  const [addOpen, setAddOpen] = useState(() => params.get('add') === '1')
  const [addKey, setAddKey] = useState(0) // remounts the form so it starts empty
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Collection | null>(null)

  const openAdd = () => {
    setAddKey((k) => k + 1)
    setAddOpen(true)
  }

  // …and then removes the flag from the URL, so a refresh doesn't reopen it.
  useEffect(() => {
    if (params.get('add') !== '1') return
    setParams(
      (prev) => {
        prev.delete('add')
        return prev
      },
      { replace: true },
    )
  }, [params, setParams])

  // Typing stays responsive: filtering re-runs with the deferred query.
  const query = useDeferredValue(filters.query)
  const visible = useMemo(
    () => (words ? sortWords(filterWords(words, { ...filters, query }), filters.sort) : []),
    [words, filters, query],
  )

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const w of words ?? [])
      for (const id of w.collectionIds) map.set(id, (map.get(id) ?? 0) + 1)
    return map
  }, [words])

  const loading = !words || !collections
  const total = words?.length ?? 0

  return (
    <>
      <PageHeader
        title={v.title}
        description={words ? v.subtitle(total) : undefined}
        actions={
          <>
            <Button variant="ghost" icon={<Upload />} onClick={() => setImportOpen(true)}>
              {t.transfer.import}
            </Button>
            {total > 0 && (
              <Button variant="ghost" icon={<Download />} onClick={() => setExportOpen(true)}>
                {t.transfer.export}
              </Button>
            )}
            <Button variant="primary" icon={<Plus />} onClick={openAdd}>
              {v.addWord}
            </Button>
          </>
        }
      />

      {loading ? (
        <Skeleton height={480} />
      ) : total === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<BookOpen />}
            title={v.emptyTitle}
            description={v.emptyText}
            action={
              <Button variant="primary" icon={<Plus />} onClick={openAdd}>
                {v.addWord}
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <CollectionBar
            collections={collections}
            counts={counts}
            total={total}
            selectedId={filters.collectionId}
            onSelect={(collectionId) => update({ collectionId })}
            onCreate={() => setCollectionOpen(true)}
            onDelete={setToDelete}
          />
          <VocabularyToolbar filters={filters} onChange={update} onClear={clear} />
          <p className={styles.resultCount} aria-live="polite">
            {v.results(visible.length, total)}
          </p>
          {visible.length === 0 ? (
            <Card padding="lg">
              <EmptyState
                icon={<SearchX />}
                title={v.noResultsTitle}
                description={v.noResultsText}
                action={<Button onClick={clear}>{v.filters.clear}</Button>}
              />
            </Card>
          ) : (
            <ul className={styles.list}>
              {visible.map((word) => (
                <WordEntry key={word.id} word={word} />
              ))}
            </ul>
          )}
        </>
      )}

      {collections && (
        <WordFormDialog
          key={addKey}
          open={addOpen}
          onClose={() => setAddOpen(false)}
          collections={collections}
          defaultCollectionId={filters.collectionId}
        />
      )}
      {importOpen && <ImportDialog open onClose={() => setImportOpen(false)} />}
      {exportOpen && words && collections && (
        <ExportDialog
          open
          onClose={() => setExportOpen(false)}
          all={words}
          visible={visible}
          collections={collections}
        />
      )}
      {collectionOpen && (
        <CollectionFormDialog
          open
          onClose={() => setCollectionOpen(false)}
          onCreated={(c) => update({ collectionId: c.id })}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        title={toDelete ? v.collections.deleteTitle(toDelete.name) : ''}
        description={v.collections.deleteText}
        confirmLabel={t.common.delete}
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (!toDelete) return
          await deleteCollection(toDelete.id)
          update({ collectionId: null })
          setToDelete(null)
          toast.success(v.collections.deleted)
        }}
      />
    </>
  )
}

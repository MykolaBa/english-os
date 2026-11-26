import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BackLink, ConfirmDialog, NotFoundCard, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { toast } from '@/stores/toastStore'
import { WordDetails } from './components/detail/WordDetails'
import { WordHero } from './components/detail/WordHero'
import { WordProgress } from './components/detail/WordProgress'
import { WordFormDialog } from './components/WordFormDialog'
import { useCollections, useWord } from './hooks'
import { deleteWord } from './wordsRepo'
import styles from './Vocabulary.module.scss'

export default function WordDetailPage() {
  const { wordId } = useParams()
  const word = useWord(wordId)
  const collections = useCollections()
  const navigate = useNavigate()
  const t = useT()
  const d = t.vocabulary.detail
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const back = (
    <BackLink to="/vocabulary" className={styles.backSpacing}>
      {d.back}
    </BackLink>
  )

  if (word === undefined) {
    return (
      <>
        {back}
        <Skeleton height={220} />
      </>
    )
  }

  if (word === null) {
    return (
      <>
        {back}
        <NotFoundCard title={d.notFoundTitle} description={d.notFoundText} />
      </>
    )
  }

  return (
    <>
      {back}
      <div className={styles.detailLayout}>
        <div className={styles.detailMain}>
          <WordHero
            word={word}
            onEdit={() => setEditOpen(true)}
            onDelete={() => setConfirmDelete(true)}
          />
          <WordDetails word={word} />
        </div>
        <WordProgress word={word} collections={collections ?? []} />
      </div>

      {/* Mounted only while open, so every opening starts from the saved word. */}
      {editOpen && collections && (
        <WordFormDialog
          open
          onClose={() => setEditOpen(false)}
          collections={collections}
          word={word}
        />
      )}
      <ConfirmDialog
        open={confirmDelete}
        title={d.deleteTitle(word.term)}
        description={d.deleteText}
        confirmLabel={t.common.delete}
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteWord(word.id)
          toast.success(d.deleted(word.term))
          navigate('/vocabulary', { replace: true })
        }}
      />
    </>
  )
}

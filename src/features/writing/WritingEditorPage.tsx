import { useParams } from 'react-router'
import { BackLink, NotFoundCard, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { useWriting } from './hooks'
import { WritingEditor } from './WritingEditor'
import styles from './Writing.module.scss'

export default function WritingEditorPage() {
  const { writingId } = useParams()
  const writing = useWriting(writingId)
  const w = useT().writing
  return (
    <div className={styles.page}>
      <BackLink to="/writing">{w.back}</BackLink>
      {writing === undefined ? (
        <Skeleton height={480} />
      ) : writing === null ? (
        <NotFoundCard title={w.notFoundTitle} description={w.notFoundText} />
      ) : (
        // Keyed: another piece starts with its own text, not the previous one's.
        <WritingEditor key={writing.id} writing={writing} />
      )}
    </div>
  )
}

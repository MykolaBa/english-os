import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader, Skeleton } from '@/components/ui'
import { useT } from '@/i18n'
import { toast } from '@/stores/toastStore'
import { PromptList } from './components/PromptList'
import { WritingList } from './components/WritingList'
import { useWritings } from './hooks'
import { createWriting } from './writingRepo'
import styles from './Writing.module.scss'

export default function WritingPage() {
  const t = useT()
  const w = t.writing
  const writings = useWritings()
  const navigate = useNavigate()

  // A double tap must not create two drafts: ignore starts while one is in progress.
  const starting = useRef(false)
  const start = (promptId: string | null) => {
    if (starting.current) return
    starting.current = true
    void createWriting(promptId)
      .then((id) => navigate(`/writing/${id}`))
      .catch((err: unknown) => toast.error(t.errors.title, String(err)))
      .finally(() => {
        starting.current = false
      })
  }

  return (
    <>
      <PageHeader title={w.title} description={w.subtitle} />
      <div className={styles.overview}>
        <section aria-labelledby="your-writing">
          <h2 id="your-writing" className={styles.sectionTitle}>
            {w.yourWriting}
          </h2>
          {!writings ? (
            <Skeleton height={160} />
          ) : writings.length === 0 ? (
            <p className={styles.muted}>{w.yourWritingEmpty}</p>
          ) : (
            <WritingList writings={writings} />
          )}
        </section>
        <section aria-labelledby="start-writing">
          <h2 id="start-writing" className={styles.sectionTitle}>
            {w.startTitle}
          </h2>
          <p className={styles.muted}>{w.startText}</p>
          <PromptList onStart={start} />
        </section>
      </div>
    </>
  )
}

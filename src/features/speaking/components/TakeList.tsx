import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button, ConfirmDialog } from '@/components/ui'
import { useT } from '@/i18n'
import { formatRelative } from '@/lib/date'
import { RECORDINGS_PER_ITEM } from '@/lib/db/limits'
import type { Recording } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { formatDuration } from '../recorder'
import { deleteRecording } from '../speakingRepo'
import { RecordingPlayer } from './RecordingPlayer'
import styles from '../Speaking.module.scss'

/** Saved takes of a task, newest first: listen back, compare with the plan, delete. */
export function TakeList({ takes }: { takes: Recording[] }) {
  const t = useT()
  const s = t.speaking
  const [toDelete, setToDelete] = useState<Recording | null>(null)
  return (
    <section aria-labelledby="takes-title" className={styles.takes}>
      <h2 id="takes-title" className={styles.sectionTitle}>
        {s.takes}
      </h2>
      {takes.length === 0 ? (
        <p className={styles.muted}>{s.takesEmpty}</p>
      ) : (
        <>
          <ol className={styles.takeList}>
            {takes.map((take) => (
              <li key={take.id} className={styles.takeRow}>
                <span className={styles.takeMeta}>
                  {s.takeMeta(
                    formatDuration(take.durationMs),
                    formatRelative(take.createdAt, t.locale, t.common.justNow),
                  )}
                </span>
                <RecordingPlayer audio={take.audio} label={s.playTake} />
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<Trash2 />}
                  aria-label={s.deleteTake}
                  onClick={() => setToDelete(take)}
                />
              </li>
            ))}
          </ol>
          <p className={styles.muted}>{s.keepNote(RECORDINGS_PER_ITEM)}</p>
        </>
      )}
      <ConfirmDialog
        open={toDelete !== null}
        title={s.deleteTake}
        description={
          toDelete
            ? s.takeMeta(
                formatDuration(toDelete.durationMs),
                formatRelative(toDelete.createdAt, t.locale, t.common.justNow),
              )
            : ''
        }
        confirmLabel={t.common.delete}
        danger
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await deleteRecording(toDelete.id)
          setToDelete(null)
          toast.success(s.deleted)
        }}
      />
    </section>
  )
}

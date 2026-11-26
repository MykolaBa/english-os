import { useRef, useState, type ChangeEvent } from 'react'
import { Download, Upload } from 'lucide-react'
import { Button, ConfirmDialog } from '@/components/ui'
import { useT } from '@/i18n'
import { formatDate, formatRelative } from '@/lib/date'
import { FileTooLargeError, readTextFile } from '@/lib/files'
import { toast } from '@/stores/toastStore'
import { parseBackup, restoreBackup, type Backup } from '@/features/backup/backup'
import { useBackupActions } from '@/features/backup/useBackupActions'
import styles from '../Settings.module.scss'

interface Pending {
  backup: Backup
  words: number
  reviews: number
  exportedAt: string
}

export function BackupSection() {
  const t = useT()
  const b = t.backup
  const { lastBackupAt, downloadBackup } = useBackupActions()
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Pending | null>(null)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow choosing the same file again
    if (!file) return
    try {
      const result = parseBackup(await readTextFile(file))
      if (!result.ok) return void toast.error(b.problems[result.problem])
      setPending({ backup: result.backup, ...result.summary })
    } catch (err) {
      toast.error(err instanceof FileTooLargeError ? b.tooLarge : t.errors.title)
    }
  }

  const restore = async () => {
    if (!pending) return
    try {
      await restoreBackup(pending.backup)
      toast.success(b.restored)
    } catch (err) {
      toast.error(t.errors.title, String(err))
    } finally {
      setPending(null)
    }
  }

  return (
    <div className={styles.backup}>
      <p className={styles.backupText}>{b.description}</p>
      <p className={styles.backupLast}>{b.audioNote}</p>
      <p className={styles.backupLast}>
        {b.last(lastBackupAt ? formatRelative(lastBackupAt, t.locale, t.common.justNow) : null)}
      </p>
      <div className={styles.backupActions}>
        <Button variant="primary" icon={<Download />} onClick={() => void downloadBackup()}>
          {b.export}
        </Button>
        <Button icon={<Upload />} onClick={() => fileInput.current?.click()}>
          {b.restore}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => void onFile(e)}
        />
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={b.restoreTitle}
        description={
          pending && (
            <>
              {b.restoreText(
                formatDate(Date.parse(pending.exportedAt), t.locale),
                pending.words,
                pending.reviews,
              )}
              <Button
                className={styles.saveFirst}
                size="sm"
                icon={<Download />}
                onClick={() => void downloadBackup()}
              >
                {b.saveFirst}
              </Button>
            </>
          )
        }
        confirmLabel={b.restoreConfirm}
        danger
        onCancel={() => setPending(null)}
        onConfirm={() => void restore()}
      />
    </div>
  )
}

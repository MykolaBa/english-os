import { useRef, useState, type ChangeEvent } from 'react'
import { FileUp } from 'lucide-react'
import { Button, Dialog } from '@/components/ui'
import { useT } from '@/i18n'
import { db } from '@/lib/db/db'
import { FileTooLargeError, readTextFile } from '@/lib/files'
import { toast } from '@/stores/toastStore'
import {
  applyImport,
  parseImportFile,
  planImport,
  type ImportPlan,
  type ParsedImport,
} from '../transfer'
import styles from '../Vocabulary.module.scss'

interface Preview {
  fileName: string
  parsed: ParsedImport
  plan: ImportPlan
}

/** Choose a file → see exactly what will happen → confirm. Nothing is saved before that. */
export function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const tr = t.transfer
  const input = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [busy, setBusy] = useState(false)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = parseImportFile(file.name, await readTextFile(file))
      const [words, collections] = await Promise.all([db.words.toArray(), db.collections.toArray()])
      setPreview({ fileName: file.name, parsed, plan: planImport(parsed.rows, words, collections) })
    } catch (err) {
      toast.error(err instanceof FileTooLargeError ? t.backup.tooLarge : t.errors.title)
    }
  }

  const confirm = async () => {
    if (!preview) return
    setBusy(true)
    try {
      const count = await applyImport(preview.plan)
      toast.success(tr.imported(count))
      onClose()
    } catch (err) {
      toast.error(t.errors.title, String(err))
    } finally {
      setBusy(false)
    }
  }

  const plan = preview?.plan
  const invalid = preview?.parsed.invalid ?? []

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={tr.importTitle}
      description={tr.importDescription}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          {plan && plan.toAdd.length > 0 && (
            <Button variant="primary" disabled={busy} onClick={() => void confirm()}>
              {tr.importConfirm(plan.toAdd.length)}
            </Button>
          )}
        </>
      }
    >
      <input
        ref={input}
        type="file"
        accept=".csv,.tsv,.txt,.json,text/csv,application/json"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => void onFile(e)}
      />

      {!preview ? (
        <div className={styles.dropzone}>
          <FileUp aria-hidden />
          <Button variant="primary" data-autofocus onClick={() => input.current?.click()}>
            {tr.chooseFile}
          </Button>
          <p>{tr.formatHint}</p>
        </div>
      ) : (
        <div className={styles.importPlan} aria-live="polite">
          <p className={styles.fileName}>{preview.fileName}</p>
          {preview.parsed.unreadable ? (
            <p>{tr.unreadable}</p>
          ) : (
            <>
              <p className={styles.planMain}>
                {plan && plan.toAdd.length > 0 ? tr.planAdd(plan.toAdd.length) : tr.planNothing}
              </p>
              {plan && plan.duplicates.length > 0 && (
                <p>{tr.planDuplicates(plan.duplicates.length)}</p>
              )}
              {plan && plan.newCollections.length > 0 && (
                <p>{tr.planCollections(plan.newCollections.join(', '))}</p>
              )}
              {invalid.length > 0 && (
                <>
                  <p>{tr.planInvalid(invalid.length)}</p>
                  <ul className={styles.problems}>
                    {invalid.slice(0, 8).map(({ line, problem }) => (
                      <li key={line}>{tr.problem[problem](line)}</li>
                    ))}
                    {invalid.length > 8 && <li>…</li>}
                  </ul>
                </>
              )}
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => input.current?.click()}>
            {tr.otherFile}
          </Button>
        </div>
      )}
    </Dialog>
  )
}

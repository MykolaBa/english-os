import { useId, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Dialog } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { Collection, Word } from '@/lib/db/types'
import { datedFilename, downloadFile } from '@/lib/files'
import { toast } from '@/stores/toastStore'
import { wordsToCsv, wordsToJson } from '../transfer'
import styles from '../Vocabulary.module.scss'

const FORMATS = ['csv', 'json'] as const
type Format = (typeof FORMATS)[number]

interface ExportDialogProps {
  open: boolean
  onClose: () => void
  all: Word[]
  /** The words currently shown (after search and filters). */
  visible: Word[]
  collections: Collection[]
}

export function ExportDialog({ open, onClose, all, visible, collections }: ExportDialogProps) {
  const t = useT()
  const tr = t.transfer
  const name = useId()
  const [format, setFormat] = useState<Format>('csv')
  const [onlyVisible, setOnlyVisible] = useState(false)
  const filtered = visible.length !== all.length

  const download = () => {
    const words = onlyVisible && filtered ? visible : all
    if (format === 'csv') {
      downloadFile(
        datedFilename('englishos-words', 'csv'),
        wordsToCsv(words, collections),
        'text/csv;charset=utf-8',
      )
    } else {
      downloadFile(
        datedFilename('englishos-words', 'json'),
        wordsToJson(words, collections),
        'application/json',
      )
    }
    toast.success(tr.exportedToast(words.length))
    onClose()
  }

  const option = (
    key: string,
    checked: boolean,
    onSelect: () => void,
    title: string,
    hint?: string,
  ) => (
    <label key={key} className={cx(styles.option, checked && styles.optionOn)}>
      <input
        type="radio"
        name={`${name}-${hint === undefined ? 'scope' : 'format'}`}
        checked={checked}
        onChange={onSelect}
      />
      <span>
        <span className={styles.optionTitle}>{title}</span>
        {hint && <span className={styles.optionHint}>{hint}</span>}
      </span>
    </label>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={tr.exportTitle}
      description={tr.exportDescription}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" icon={<Download />} onClick={download} data-autofocus>
            {tr.download}
          </Button>
        </>
      }
    >
      <div className={styles.exportForm}>
        <fieldset className={styles.fieldset}>
          <legend>{tr.format}</legend>
          <div className={styles.options}>
            {FORMATS.map((f) =>
              option(f, format === f, () => setFormat(f), tr.formats[f].title, tr.formats[f].hint),
            )}
          </div>
        </fieldset>
        {filtered && (
          <fieldset className={styles.fieldset}>
            <legend>{tr.scope}</legend>
            <div className={styles.options}>
              {option('all', !onlyVisible, () => setOnlyVisible(false), tr.scopeAll(all.length))}
              {option(
                'visible',
                onlyVisible,
                () => setOnlyVisible(true),
                tr.scopeVisible(visible.length),
              )}
            </div>
          </fieldset>
        )}
      </div>
    </Dialog>
  )
}

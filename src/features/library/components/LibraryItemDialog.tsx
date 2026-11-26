import { useId, useRef, useState, type FormEvent } from 'react'
import { FileUp } from 'lucide-react'
import { Button, Dialog, TextAreaField, TextField } from '@/components/ui'
import { useT } from '@/i18n'
import { LIBRARY_TEXT_MAX, LIBRARY_TITLE_MAX, TEXT_MAX, URL_MAX } from '@/lib/db/limits'
import type { LibraryItem } from '@/lib/db/types'
import { FileTooLargeError, readTextFile } from '@/lib/files'
import { toast } from '@/stores/toastStore'
import {
  addLibraryItem,
  EMPTY_LIBRARY_DRAFT,
  itemToDraft,
  updateLibraryItem,
  validateLibraryDraft,
  type LibraryDraft,
  type LibraryDraftError,
} from '../libraryRepo'
import { guessTitle } from '../text'
import styles from '../Library.module.scss'

interface Props {
  /** Edit mode when given. */
  item?: LibraryItem
  onClose: () => void
  onSaved?: (id: string) => void
}

/** Add or edit a library item. Mount it only while open: the draft starts fresh. */
export function LibraryItemDialog({ item, onClose, onSaved }: Props) {
  const t = useT()
  const f = t.library.form
  const formId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState<LibraryDraft>(() =>
    item ? itemToDraft(item) : EMPTY_LIBRARY_DRAFT,
  )
  const [error, setError] = useState<LibraryDraftError | null>(null)
  const [saving, setSaving] = useState(false)
  const set = (key: keyof LibraryDraft, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setError(null)
  }

  const importFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await readTextFile(file)
      setDraft((d) => ({
        ...d,
        text: text.slice(0, LIBRARY_TEXT_MAX),
        title: d.title || guessTitle(text) || file.name.replace(/\.txt$/i, ''),
      }))
    } catch (err) {
      toast.error(err instanceof FileTooLargeError ? f.fileTooLarge : t.errors.title, String(err))
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const problem = validateLibraryDraft(draft)
    if (problem) return setError(problem)
    setSaving(true)
    try {
      const id = item
        ? (await updateLibraryItem(item.id, draft), item.id)
        : await addLibraryItem(draft)
      toast.success(item ? f.saved : f.added)
      onSaved?.(id)
      onClose()
    } catch (err) {
      toast.error(t.errors.title, String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={item ? f.editTitle : f.addTitle}
      description={f.description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" type="submit" form={formId} disabled={saving}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className={styles.form}>
        <TextField
          label={f.title}
          placeholder={f.titlePlaceholder}
          value={draft.title}
          maxLength={LIBRARY_TITLE_MAX}
          onChange={(e) => set('title', e.target.value)}
          data-autofocus
          lang="en"
        />
        <TextField
          label={f.url}
          placeholder={f.urlPlaceholder}
          value={draft.url}
          maxLength={URL_MAX}
          inputMode="url"
          autoComplete="off"
          onChange={(e) => set('url', e.target.value)}
          error={error === 'badUrl' ? f.errors.badUrl : undefined}
        />
        <TextAreaField
          label={f.text}
          placeholder={f.textPlaceholder}
          value={draft.text}
          rows={9}
          maxLength={LIBRARY_TEXT_MAX}
          onChange={(e) => set('text', e.target.value)}
          error={error === 'needContent' ? f.errors.needContent : undefined}
          lang="en"
        />
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            hidden
            onChange={(e) => void importFile(e.target.files?.[0])}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={<FileUp />}
            onClick={() => fileRef.current?.click()}
          >
            {f.importFile}
          </Button>
        </div>
        <TextField
          label={f.tags}
          hint={f.tagsHint}
          value={draft.tags}
          onChange={(e) => set('tags', e.target.value)}
          autoComplete="off"
        />
        <TextAreaField
          label={f.notes}
          value={draft.notes}
          rows={2}
          maxLength={TEXT_MAX}
          onChange={(e) => set('notes', e.target.value)}
        />
      </form>
    </Dialog>
  )
}

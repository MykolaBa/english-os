import { useId, useState, type FormEvent } from 'react'
import { Button, Dialog, TextField } from '@/components/ui'
import { useT } from '@/i18n'
import type { Collection } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { createCollection, DuplicateError } from '../wordsRepo'
import styles from '../Vocabulary.module.scss'

interface CollectionFormDialogProps {
  open: boolean
  onClose: () => void
  onCreated: (collection: Collection) => void
}

export function CollectionFormDialog({ open, onClose, onCreated }: CollectionFormDialogProps) {
  const t = useT()
  const c = t.vocabulary.collections
  const formId = useId()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | undefined>()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError(c.nameRequired)
    try {
      const created = await createCollection(name, description)
      toast.success(c.created(created.name))
      onCreated(created)
      onClose()
    } catch (err) {
      setError(err instanceof DuplicateError ? c.nameTaken : String(err))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={c.createTitle}
      description={c.createDescription}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" type="submit" form={formId}>
            {t.common.save}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit} noValidate>
        <TextField
          label={c.nameLabel}
          placeholder={c.namePlaceholder}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(undefined)
          }}
          error={error}
          maxLength={60}
          data-autofocus
        />
        <TextField
          label={`${c.descriptionLabel} (${t.common.optional})`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={140}
        />
      </form>
    </Dialog>
  )
}

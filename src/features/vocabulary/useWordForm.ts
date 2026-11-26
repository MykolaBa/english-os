import { useState, type FormEvent } from 'react'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import {
  EMPTY_DRAFT,
  validateDraft,
  wordToDraft,
  type WordDraft,
  type WordDraftErrors,
} from './model'
import { addWord, DuplicateError, updateWord } from './wordsRepo'

interface Options {
  /** Edit mode when provided. */
  word?: Word
  defaultCollectionId?: string | null
  initial?: Partial<WordDraft>
  onSaved: () => void
}

/** The add/edit form's state and saving logic, separate from its markup. */
export function useWordForm({ word, defaultCollectionId, initial, onSaved }: Options) {
  const t = useT()
  const f = t.vocabulary.form
  const [draft, setDraft] = useState<WordDraft>(() =>
    word
      ? wordToDraft(word)
      : {
          ...EMPTY_DRAFT,
          collectionIds: defaultCollectionId ? [defaultCollectionId] : [],
          ...initial,
        },
  )
  const [errors, setErrors] = useState<WordDraftErrors>({})
  const [duplicate, setDuplicate] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof WordDraft>(key: K, value: WordDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    if (key === 'term') setDuplicate(null)
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const toggleCollection = (id: string) =>
    set(
      'collectionIds',
      draft.collectionIds.includes(id)
        ? draft.collectionIds.filter((c) => c !== id)
        : [...draft.collectionIds, id],
    )

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateDraft(draft)
    setErrors(found)
    // Long fields have no inline message of their own (maxLength usually prevents it).
    if (found.details) toast.error(f[found.details])
    if (Object.keys(found).length > 0) return

    setSaving(true)
    try {
      if (word) {
        await updateWord(word.id, draft)
        toast.success(f.saved)
      } else {
        const created = await addWord(draft)
        toast.success(f.added(created.term))
      }
      onSaved()
    } catch (err) {
      if (err instanceof DuplicateError) setDuplicate(err.value)
      else toast.error(t.errors.title, String(err))
    } finally {
      setSaving(false)
    }
  }

  return { draft, set, toggleCollection, errors, duplicate, saving, submit }
}

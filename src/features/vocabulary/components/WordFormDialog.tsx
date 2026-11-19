import { useId, useState, type FormEvent } from 'react'
import {
  Button,
  Chip,
  Dialog,
  SelectField,
  TextAreaField,
  TextField,
  type SelectOption,
} from '@/components/ui'
import { useT } from '@/i18n'
import {
  CEFR_LEVELS,
  type CefrLevel,
  type Collection,
  type PartOfSpeech,
  type Word,
} from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import {
  EMPTY_DRAFT,
  PARTS_OF_SPEECH,
  validateDraft,
  wordToDraft,
  type WordDraft,
  type WordDraftErrors,
} from '../model'
import { addWord, DuplicateError, updateWord } from '../wordsRepo'
import { CollectionIcon } from './CollectionIcon'
import styles from '../Vocabulary.module.scss'

interface WordFormDialogProps {
  open: boolean
  onClose: () => void
  collections: Collection[]
  /** Edit mode when provided. */
  word?: Word
  /** Pre-selected collection when adding from a filtered view. */
  defaultCollectionId?: string | null
}

/** Mount with a `key` that changes per opening, so the draft state starts fresh. */
export function WordFormDialog({
  open,
  onClose,
  collections,
  word,
  defaultCollectionId,
}: WordFormDialogProps) {
  const t = useT()
  const f = t.vocabulary.form
  const formId = useId()
  const [draft, setDraft] = useState<WordDraft>(() =>
    word
      ? wordToDraft(word)
      : { ...EMPTY_DRAFT, collectionIds: defaultCollectionId ? [defaultCollectionId] : [] },
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
      onClose()
    } catch (err) {
      if (err instanceof DuplicateError) setDuplicate(err.value)
      else toast.error(t.errors.title, String(err))
    } finally {
      setSaving(false)
    }
  }

  const levelOptions: SelectOption<CefrLevel | ''>[] = [
    { value: '', label: f.noValue },
    ...CEFR_LEVELS.map((l) => ({ value: l, label: l })),
  ]
  const posOptions: SelectOption<PartOfSpeech | ''>[] = [
    { value: '', label: f.noValue },
    ...PARTS_OF_SPEECH.map((p) => ({ value: p, label: t.partOfSpeech[p] })),
  ]
  const hasExtras = Boolean(draft.synonyms || draft.antonyms || draft.collocations || draft.notes)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={word ? f.editTitle : f.addTitle}
      description={f.description}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button variant="primary" type="submit" form={formId} disabled={saving}>
            {word ? t.common.saveChanges : t.common.save}
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.formRow}>
          <TextField
            label={f.term}
            placeholder={f.termPlaceholder}
            value={draft.term}
            onChange={(e) => set('term', e.target.value)}
            error={duplicate ? f.duplicate(duplicate) : errors.term && f[errors.term]}
            data-autofocus
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            lang="en"
            maxLength={120}
          />
          <TextField
            label={f.translation}
            placeholder={f.translationPlaceholder}
            value={draft.translation}
            onChange={(e) => set('translation', e.target.value)}
            error={errors.translation && f[errors.translation]}
            autoComplete="off"
            lang="uk"
            maxLength={300}
          />
        </div>
        <TextAreaField
          label={f.definition}
          placeholder={f.definitionPlaceholder}
          value={draft.definition}
          onChange={(e) => set('definition', e.target.value)}
          rows={2}
          lang="en"
        />
        <div className={styles.formRow3}>
          <SelectField
            label={f.partOfSpeech}
            options={posOptions}
            value={draft.partOfSpeech}
            onChange={(v) => set('partOfSpeech', v)}
          />
          <SelectField
            label={f.level}
            options={levelOptions}
            value={draft.level}
            onChange={(v) => set('level', v)}
          />
          <TextField
            label={f.phonetic}
            placeholder="/ˈwɜːd/"
            value={draft.phonetic}
            onChange={(e) => set('phonetic', e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className={styles.formRow}>
          <TextAreaField
            label={f.example}
            placeholder={f.examplePlaceholder}
            value={draft.example}
            onChange={(e) => set('example', e.target.value)}
            rows={2}
            lang="en"
          />
          <TextAreaField
            label={f.exampleTranslation}
            value={draft.exampleTranslation}
            onChange={(e) => set('exampleTranslation', e.target.value)}
            rows={2}
            lang="uk"
          />
        </div>
        {collections.length > 0 && (
          <fieldset className={styles.fieldset}>
            <legend>{f.collections}</legend>
            <div className={styles.chipWrap}>
              {collections.map((c) => (
                <Chip
                  key={c.id}
                  selected={draft.collectionIds.includes(c.id)}
                  icon={<CollectionIcon name={c.icon} />}
                  onClick={() => toggleCollection(c.id)}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}
        <details className={styles.more} open={hasExtras || undefined}>
          <summary>{f.more}</summary>
          <div className={styles.moreBody}>
            <div className={styles.formRow3}>
              <TextField
                label={f.synonyms}
                hint={f.listHint}
                value={draft.synonyms}
                onChange={(e) => set('synonyms', e.target.value)}
                lang="en"
              />
              <TextField
                label={f.antonyms}
                hint={f.listHint}
                value={draft.antonyms}
                onChange={(e) => set('antonyms', e.target.value)}
                lang="en"
              />
              <TextField
                label={f.collocations}
                hint={f.listHint}
                value={draft.collocations}
                onChange={(e) => set('collocations', e.target.value)}
                lang="en"
              />
            </div>
            <TextAreaField
              label={f.notes}
              placeholder={f.notesPlaceholder}
              value={draft.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
            />
          </div>
        </details>
      </form>
    </Dialog>
  )
}

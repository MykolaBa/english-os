import { useId } from 'react'
import {
  Button,
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
import { PARTS_OF_SPEECH, TERM_MAX, TEXT_MAX, TRANSLATION_MAX, type WordDraft } from '../model'
import { useWordForm } from '../useWordForm'
import { WordFormExtras } from './WordFormExtras'
import styles from '../Vocabulary.module.scss'

interface WordFormDialogProps {
  open: boolean
  onClose: () => void
  collections: Collection[]
  /** Edit mode when provided. */
  word?: Word
  /** Pre-selected collection when adding from a filtered view. */
  defaultCollectionId?: string | null
  /** Prefilled fields when adding, e.g. a word tapped in a reading text. */
  initial?: Partial<WordDraft>
}

/** Mount it only while open (or with a new `key` per opening): the draft starts fresh. */
export function WordFormDialog({
  open,
  onClose,
  collections,
  word,
  defaultCollectionId,
  initial,
}: WordFormDialogProps) {
  const t = useT()
  const f = t.vocabulary.form
  const formId = useId()
  const { draft, set, toggleCollection, errors, duplicate, saving, submit } = useWordForm({
    word,
    defaultCollectionId,
    initial,
    onSaved: onClose,
  })

  const levelOptions: SelectOption<CefrLevel | ''>[] = [
    { value: '', label: f.noValue },
    ...CEFR_LEVELS.map((l) => ({ value: l, label: l })),
  ]
  const posOptions: SelectOption<PartOfSpeech | ''>[] = [
    { value: '', label: f.noValue },
    ...PARTS_OF_SPEECH.map((p) => ({ value: p, label: t.partOfSpeech[p] })),
  ]

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
            maxLength={TERM_MAX}
          />
          <TextField
            label={f.translation}
            placeholder={f.translationPlaceholder}
            value={draft.translation}
            onChange={(e) => set('translation', e.target.value)}
            error={errors.translation && f[errors.translation]}
            autoComplete="off"
            lang="uk"
            maxLength={TRANSLATION_MAX}
          />
        </div>
        <TextAreaField
          label={f.definition}
          placeholder={f.definitionPlaceholder}
          value={draft.definition}
          onChange={(e) => set('definition', e.target.value)}
          rows={2}
          lang="en"
          maxLength={TEXT_MAX}
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
            maxLength={TEXT_MAX}
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
            maxLength={TEXT_MAX}
          />
          <TextAreaField
            label={f.exampleTranslation}
            value={draft.exampleTranslation}
            onChange={(e) => set('exampleTranslation', e.target.value)}
            rows={2}
            lang="uk"
            maxLength={TEXT_MAX}
          />
        </div>
        <WordFormExtras
          draft={draft}
          set={set}
          collections={collections}
          onToggleCollection={toggleCollection}
        />
      </form>
    </Dialog>
  )
}

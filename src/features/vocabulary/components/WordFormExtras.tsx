import { Chip, TextAreaField, TextField } from '@/components/ui'
import { useT } from '@/i18n'
import type { Collection } from '@/lib/db/types'
import { TEXT_MAX, type WordDraft } from '../model'
import { CollectionIcon } from './CollectionIcon'
import styles from '../Vocabulary.module.scss'

interface Props {
  draft: WordDraft
  set: <K extends keyof WordDraft>(key: K, value: WordDraft[K]) => void
  collections: Collection[]
  onToggleCollection: (id: string) => void
}

/** Collections and the optional "more details" (synonyms, antonyms, collocations, notes). */
export function WordFormExtras({ draft, set, collections, onToggleCollection }: Props) {
  const f = useT().vocabulary.form
  const hasExtras = Boolean(draft.synonyms || draft.antonyms || draft.collocations || draft.notes)
  const list = (key: 'synonyms' | 'antonyms' | 'collocations') => (
    <TextField
      label={f[key]}
      hint={f.listHint}
      value={draft[key]}
      onChange={(e) => set(key, e.target.value)}
      lang="en"
      maxLength={TEXT_MAX}
    />
  )

  return (
    <>
      {collections.length > 0 && (
        <fieldset className={styles.fieldset}>
          <legend>{f.collections}</legend>
          <div className={styles.chipWrap}>
            {collections.map((c) => (
              <Chip
                key={c.id}
                selected={draft.collectionIds.includes(c.id)}
                icon={<CollectionIcon name={c.icon} />}
                onClick={() => onToggleCollection(c.id)}
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
            {list('synonyms')}
            {list('antonyms')}
            {list('collocations')}
          </div>
          <TextAreaField
            label={f.notes}
            placeholder={f.notesPlaceholder}
            value={draft.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
            maxLength={TEXT_MAX}
          />
        </div>
      </details>
    </>
  )
}

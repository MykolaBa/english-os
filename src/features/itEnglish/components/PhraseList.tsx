import { useState } from 'react'
import { BookmarkPlus, CircleCheck } from 'lucide-react'
import { Button, SpeakButton } from '@/components/ui'
import type { Phrase } from '@/content/it'
import { useT } from '@/i18n'
import { useCollections, useVocabularyIndex } from '@/features/vocabulary/hooks'
import { normalizeTerm } from '@/features/vocabulary/model'
import { seedCollectionId } from '@/features/vocabulary/seed'
import { WordFormDialog } from '@/features/vocabulary/components/WordFormDialog'
import styles from '../ItEnglish.module.scss'

interface PhraseListProps {
  phrases: readonly Phrase[]
  /** Starter collection the saved phrase goes to, if the learner still has it. */
  collectionSlug: 'work' | 'interviews'
}

/** English phrase, its Ukrainian meaning, pronunciation and "save to vocabulary". */
export function PhraseList({ phrases, collectionSlug }: PhraseListProps) {
  const t = useT()
  const s = t.itEnglish
  const vocabulary = useVocabularyIndex()
  const collections = useCollections()
  const [adding, setAdding] = useState<Phrase | null>(null)
  const collectionId = seedCollectionId(collectionSlug)
  const hasCollection = collections?.some((c) => c.id === collectionId) ?? false

  return (
    <>
      <ul className={styles.phrases}>
        {phrases.map((p) => {
          const known = vocabulary?.has(normalizeTerm(p.en)) ?? false
          return (
            <li key={p.en} className={styles.phrase}>
              <div className={styles.phraseText}>
                <p className={styles.phraseEn} lang="en">
                  {p.en}
                </p>
                <p className={styles.phraseUk} lang="uk">
                  {p.uk}
                </p>
                {p.note && <p className={styles.phraseNote}>{p.note}</p>}
              </div>
              <div className={styles.phraseActions}>
                <SpeakButton text={p.en} />
                {known ? (
                  <span className={styles.known} title={s.inVocabulary}>
                    <CircleCheck aria-hidden />
                    <span className="visually-hidden">{s.inVocabulary}</span>
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    icon={<BookmarkPlus />}
                    aria-label={`${s.addPhrase}: ${p.en}`}
                    onClick={() => setAdding(p)}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
      {adding && collections && (
        <WordFormDialog
          key={adding.en}
          open
          onClose={() => setAdding(null)}
          collections={collections}
          initial={{
            term: adding.en,
            translation: adding.uk,
            partOfSpeech: 'phrase',
            collectionIds: hasCollection ? [collectionId] : [],
          }}
        />
      )}
    </>
  )
}

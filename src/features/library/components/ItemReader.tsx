import { useMemo, useState } from 'react'
import { Card } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { ReadingArticle } from '@/features/reading/components/ReadingArticle'
import { WordPanel } from '@/features/reading/components/WordPanel'
import { draftFor, knownFor, type WordSelection } from '@/features/reading/selection'
import { splitParagraphs } from '../text'
import styles from '../Library.module.scss'

interface Props {
  text: string
  vocabulary: Map<string, Word>
  onAdd: (draft: ReturnType<typeof draftFor>, key: string) => void
}

/** Your text in the same reader as graded texts: tap any word to look it up and save it. */
export function ItemReader({ text, vocabulary, onAdd }: Props) {
  const source = useMemo(() => ({ paragraphs: splitParagraphs(text), glossary: [] }), [text])
  const [selection, setSelection] = useState<WordSelection | null>(null)
  const l = useT().library
  return (
    <div className={styles.readerLayout}>
      <Card padding="lg">
        <ReadingArticle
          text={source}
          vocabulary={vocabulary}
          selectedId={selection?.id ?? null}
          onSelect={setSelection}
        />
      </Card>
      <WordPanel
        headword={selection?.text ?? null}
        known={selection ? knownFor(source, selection, vocabulary) : undefined}
        onAdd={() => selection && onAdd(draftFor(source, selection), selection.id)}
        onClose={() => setSelection(null)}
        noTranslationHint={l.noTranslation}
      />
    </div>
  )
}

import { BookmarkPlus, CircleCheck } from 'lucide-react'
import { Button, Card, CardHeader } from '@/components/ui'
import type { GlossaryItem } from '@/content/reading'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { normalizeTerm } from '@/features/vocabulary/model'
import styles from '../Reading.module.scss'

interface KeyWordsProps {
  glossary: readonly GlossaryItem[]
  vocabulary: Map<string, Word>
  onAdd: (index: number) => void
}

/** The text's glossary as a list: the keyboard-friendly way to save its key words. */
export function KeyWords({ glossary, vocabulary, onAdd }: KeyWordsProps) {
  const t = useT()
  const r = t.reading
  return (
    <Card>
      <CardHeader title={r.keyWords} description={r.keyWordsText} />
      <ul className={styles.keyWords}>
        {glossary.map((g, i) => {
          const known = vocabulary.has(normalizeTerm(g.term))
          return (
            <li key={g.term} className={styles.keyWord}>
              <div className={styles.keyWordText}>
                <span className={styles.keyTerm} lang="en">
                  {g.term}
                </span>
                <span className={styles.keyTranslation} lang="uk">
                  {g.translation}
                </span>
              </div>
              {known ? (
                <span className={styles.knownLabel}>
                  <CircleCheck aria-hidden />
                  <span className="visually-hidden">{r.inVocabulary}</span>
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<BookmarkPlus />}
                  aria-label={`${r.addWord}: ${g.term}`}
                  onClick={() => onAdd(i)}
                />
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

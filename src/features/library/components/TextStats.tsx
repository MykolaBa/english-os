import { useMemo } from 'react'
import { Gauge, Plus } from 'lucide-react'
import { Button, Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { COMMON_WORDS } from '@/content/vocabulary/commonWords'
import { coverage, unknownWords, type UnknownWord } from '../text'
import styles from '../Library.module.scss'

interface Props {
  text: string
  vocabulary: Map<string, Word>
  onAdd: (word: UnknownWord) => void
}

/** How much of the text you know, and the new words worth learning from it. */
export function TextStats({ text, vocabulary, onAdd }: Props) {
  const l = useT().library
  const s = l.stats
  const cover = useMemo(() => coverage(text, vocabulary, COMMON_WORDS), [text, vocabulary])
  const unknown = useMemo(() => unknownWords(text, vocabulary, COMMON_WORDS), [text, vocabulary])
  const words = text.split(/\s+/).filter(Boolean).length
  const level = cover.percent >= 95 ? s.level.easy : cover.percent >= 80 ? s.level.ok : s.level.hard

  return (
    <Card>
      <CardHeader
        icon={<Gauge />}
        title={s.title}
        description={`${s.words(words)}, ${s.minutes(Math.max(1, Math.ceil(words / 120)))}`}
      />
      <p className={styles.coverage}>
        <strong>{s.coverage(cover.percent)}</strong> {level}
      </p>
      <h3 className={styles.subTitle}>{l.unknownTitle}</h3>
      {unknown.length === 0 ? (
        <p className={styles.muted}>{l.unknownNone}</p>
      ) : (
        <>
          <p className={styles.muted}>{l.unknownText}</p>
          <ul className={styles.unknown}>
            {unknown.map((u) => (
              <li key={u.word}>
                <span lang="en">{u.word}</span>
                <small>{l.times(u.count)}</small>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  icon={<Plus />}
                  aria-label={l.addWord(u.word)}
                  onClick={() => onAdd(u)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}

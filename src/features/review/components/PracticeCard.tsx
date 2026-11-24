import { useMemo, useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { Button, Card, CardHeader, Select } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { buildPracticeQueue, isLearned, PRACTICE_ORDERS, type PracticeOrder } from '../queue'
import styles from '../Review.module.scss'

const SIZES = [10, 20, 50] as const
type Size = `${(typeof SIZES)[number]}` | 'all'

interface PracticeCardProps {
  words: Word[]
  collectionId: string | null
  onStart: (queue: Word[]) => void
}

/** Extra rounds on words you already know — independent of what is due today. */
export function PracticeCard({ words, collectionId, onStart }: PracticeCardProps) {
  const p = useT().review.practice
  const [order, setOrder] = useState<PracticeOrder>('weakest')
  const [size, setSize] = useState<Size>('20')

  const available = useMemo(
    () =>
      words.filter((w) => isLearned(w) && (!collectionId || w.collectionIds.includes(collectionId)))
        .length,
    [words, collectionId],
  )

  // The chosen size may not be offered (e.g. 20 with only 15 learned words): fall back to "all".
  const effectiveSize: Size = size === 'all' || Number(size) < available ? size : 'all'

  const start = () =>
    onStart(
      buildPracticeQueue(words, {
        order,
        collectionId,
        limit: effectiveSize === 'all' ? null : Number(effectiveSize),
      }),
    )

  return (
    <Card>
      <CardHeader icon={<Dumbbell />} title={p.title} description={p.text} />
      {available === 0 ? (
        <p className={styles.practiceNote}>{p.none}</p>
      ) : (
        <>
          <p className={styles.practiceNote}>
            {p.available(available)} {p.settingsNote}
          </p>
          <div className={styles.practiceControls}>
            <Select<PracticeOrder>
              variant="pill"
              aria-label={p.order}
              value={order}
              onChange={setOrder}
              options={PRACTICE_ORDERS.map((o) => ({ value: o, label: p.orders[o] }))}
            />
            <Select<Size>
              variant="pill"
              aria-label={p.size}
              value={effectiveSize}
              onChange={setSize}
              options={[
                ...SIZES.filter((n) => n < available).map((n) => ({
                  value: `${n}` as const,
                  label: p.sizeOption(n),
                })),
                { value: 'all', label: p.all(available) },
              ]}
            />
            <Button variant="secondary" icon={<Dumbbell />} onClick={start}>
              {p.start}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

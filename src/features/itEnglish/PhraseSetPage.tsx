import { useState } from 'react'
import { SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { Card, EmptyState } from '@/components/ui'
import { getPhraseSet } from '@/content/it'
import { useT } from '@/i18n'
import { BackLink } from './components/BackLink'
import { PhraseList } from './components/PhraseList'
import { PhrasePractice } from './components/PhrasePractice'
import type { DrillExercise } from './drill'
import styles from './ItEnglish.module.scss'

export default function PhraseSetPage() {
  const { setId } = useParams()
  const set = setId ? getPhraseSet(setId) : undefined
  const s = useT().itEnglish
  const [drill, setDrill] = useState<DrillExercise[] | null>(null)

  if (!set) {
    return (
      <div className={styles.page}>
        <BackLink />
        <Card padding="lg">
          <EmptyState icon={<SearchX />} title={s.notFoundTitle} description={s.notFoundText} />
        </Card>
      </div>
    )
  }

  return (
    <article className={styles.page}>
      <BackLink />
      <header className={styles.hero}>
        <h1 className={styles.heroTitle} lang="en">
          {set.title}
        </h1>
        <p className={styles.muted}>{set.summary}</p>
      </header>
      {/* The list holds the answers: hidden while a practice round runs. */}
      {!drill && (
        <Card>
          <PhraseList phrases={set.phrases} collectionSlug="work" />
        </Card>
      )}
      <PhrasePractice set={set} drill={drill} onDrillChange={setDrill} />
    </article>
  )
}

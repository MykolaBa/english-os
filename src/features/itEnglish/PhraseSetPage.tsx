import { useState } from 'react'
import { useParams } from 'react-router'
import { BackLink, Card, NotFoundCard } from '@/components/ui'
import { getPhraseSet } from '@/content/it'
import { useT } from '@/i18n'
import { PhraseList } from './components/PhraseList'
import { PhrasePractice } from './components/PhrasePractice'
import styles from './ItEnglish.module.scss'

export default function PhraseSetPage() {
  const { setId } = useParams()
  const set = setId ? getPhraseSet(setId) : undefined
  const s = useT().itEnglish
  const [practising, setPractising] = useState(false)

  if (!set) {
    return (
      <div className={styles.page}>
        <BackLink to="/it-english">{s.back}</BackLink>
        <NotFoundCard title={s.notFoundTitle} description={s.notFoundText} />
      </div>
    )
  }

  return (
    <article className={styles.page}>
      <BackLink to="/it-english">{s.back}</BackLink>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle} lang="en">
          {set.title}
        </h1>
        <p className={styles.muted}>{set.summary}</p>
      </header>
      {/* The list holds the answers: hidden while a practice round runs. */}
      {!practising && (
        <Card>
          <PhraseList phrases={set.phrases} collectionSlug="work" />
        </Card>
      )}
      <PhrasePractice set={set} onRunningChange={setPractising} />
    </article>
  )
}

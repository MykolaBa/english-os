import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Badge, PageHeader, Skeleton } from '@/components/ui'
import { READING_TEXTS } from '@/content/reading'
import { useT } from '@/i18n'
import { useReadingProgressMap } from './hooks'
import { readingMinutes } from './readingTime'
import styles from './Reading.module.scss'

export default function ReadingPage() {
  const t = useT()
  const r = t.reading
  const progress = useReadingProgressMap()

  return (
    <>
      <PageHeader title={r.title} description={r.subtitle} />
      {!progress ? (
        <Skeleton height={420} />
      ) : (
        <ul className={styles.texts}>
          {READING_TEXTS.map((text) => {
            const p = progress.get(text.id)
            const read = p?.readAt !== undefined
            return (
              <li key={text.id}>
                <Link to={`/reading/${text.id}`} className={styles.textRow}>
                  <div className={styles.textMain}>
                    <div className={styles.textMeta}>
                      <Badge tone="accent">{text.level}</Badge>
                      <span>{r.meta(r.topics[text.topic], readingMinutes(text))}</span>
                    </div>
                    <h2 className={styles.textTitle} lang="en">
                      {text.title}
                    </h2>
                    <p className={styles.textSummary}>{text.summary}</p>
                  </div>
                  <span className={read ? styles.textRead : styles.textUnread}>
                    {read && <CircleCheck aria-hidden />}
                    {read ? r.read(p.bestScore ?? 0) : r.notRead}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Badge, PageHeader, Skeleton } from '@/components/ui'
import { LISTENING_EPISODES } from '@/content/listening'
import { useT } from '@/i18n'
import { useListeningProgressMap } from './hooks'
import styles from './Listening.module.scss'

export default function ListeningPage() {
  const l = useT().listening
  const progress = useListeningProgressMap()
  return (
    <>
      <PageHeader title={l.title} description={l.subtitle} />
      {!progress ? (
        <Skeleton height={420} />
      ) : (
        <ul className={styles.list}>
          {LISTENING_EPISODES.map((e) => {
            const p = progress.get(e.id)
            const done = p?.completedAt !== undefined
            return (
              <li key={e.id}>
                <Link to={`/listening/${e.id}`} className={styles.row}>
                  <span className={styles.rowMain}>
                    <span className={styles.rowMeta}>
                      <Badge tone="accent">{e.level}</Badge>
                      {l.meta(l.topics[e.topic], e.lines.length)}
                    </span>
                    <span className={styles.rowTitle} lang="en">
                      {e.title}
                    </span>
                    <span className={styles.rowText}>{e.summary}</span>
                  </span>
                  <span className={done ? styles.statusDone : styles.status}>
                    {done && <CircleCheck aria-hidden />}
                    {done ? l.done(p.bestScore ?? 0) : l.notDone}
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

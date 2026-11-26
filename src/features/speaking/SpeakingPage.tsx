import { useMemo } from 'react'
import { Link } from 'react-router'
import { Badge, PageHeader, Skeleton } from '@/components/ui'
import { SHADOWING_SETS, SPEAKING_TASKS } from '@/content/speaking'
import { useT } from '@/i18n'
import { useRecordings } from './hooks'
import { isRecordingSupported } from './recorder'
import { MicProblem } from './components/MicProblem'
import styles from './Speaking.module.scss'

const ALL_IDS = [
  ...SHADOWING_SETS.flatMap((set) => set.sentences.map((x) => x.id)),
  ...SPEAKING_TASKS.map((task) => task.id),
]

export default function SpeakingPage() {
  const s = useT().speaking
  const takes = useRecordings(ALL_IDS)
  // A sentence "sounds good" when its newest take was rated so.
  const goodBySet = useMemo(() => {
    const counts = new Map<string, number>()
    for (const set of SHADOWING_SETS) {
      const good = set.sentences.filter((x) => takes?.get(x.id)?.[0]?.rating === 'good').length
      counts.set(set.id, good)
    }
    return counts
  }, [takes])

  return (
    <>
      <PageHeader title={s.title} description={s.subtitle} />
      {!isRecordingSupported() && <MicProblem status="unsupported" />}
      {!takes ? (
        <Skeleton height={420} />
      ) : (
        <div className={styles.overview}>
          <section aria-labelledby="shadowing-title">
            <h2 id="shadowing-title" className={styles.sectionTitle}>
              {s.shadowingTitle}
            </h2>
            <p className={styles.muted}>{s.shadowingText}</p>
            <ul className={styles.list}>
              {SHADOWING_SETS.map((set) => (
                <li key={set.id}>
                  <Link to={`/speaking/shadow/${set.id}`} className={styles.row}>
                    <span className={styles.rowMain}>
                      <span className={styles.rowTitle} lang="en">
                        {set.title}
                      </span>
                      <span className={styles.rowText}>
                        {s.setProgress(goodBySet.get(set.id) ?? 0, set.sentences.length)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="tasks-title">
            <h2 id="tasks-title" className={styles.sectionTitle}>
              {s.tasksTitle}
            </h2>
            <p className={styles.muted}>{s.tasksText}</p>
            <ul className={styles.list}>
              {SPEAKING_TASKS.map((task) => (
                <li key={task.id}>
                  <Link to={`/speaking/task/${task.id}`} className={styles.row}>
                    <span className={styles.rowMain}>
                      <span className={styles.rowMeta}>
                        <Badge tone="accent">{task.level}</Badge>
                        {s.taskMeta(s.minutes(task.seconds), takes.get(task.id)?.length ?? 0)}
                      </span>
                      <span className={styles.rowTitle} lang="en">
                        {task.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      <p className={styles.privacy}>{s.privacy}</p>
    </>
  )
}

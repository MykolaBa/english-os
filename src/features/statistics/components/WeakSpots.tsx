import { LifeBuoy } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { getLesson } from '@/content/grammar'
import { useT } from '@/i18n'
import type { LessonProgress } from '@/lib/db/types'
import type { StatisticsData } from '../useStatistics'
import styles from '../Statistics.module.scss'

interface WeakSpotsProps {
  missed: StatisticsData['missed']
  lessons: LessonProgress[]
}

/** The two lists worth acting on: words you keep forgetting, lessons below the pass mark. */
export function WeakSpots({ missed, lessons }: WeakSpotsProps) {
  const s = useT().statistics.weak
  const weak = lessons.flatMap((p) => {
    const lesson = getLesson(p.lessonId)
    return lesson ? [{ progress: p, lesson }] : []
  })

  return (
    <Card>
      <CardHeader icon={<LifeBuoy />} title={s.title} />
      <h3 className={styles.listTitle}>{s.words}</h3>
      {missed.length === 0 ? (
        <p className={styles.listEmpty}>{s.wordsEmpty}</p>
      ) : (
        <ul className={styles.list}>
          {missed.map((m) => (
            <li key={m.wordId}>
              <Link to={`/vocabulary/${m.wordId}`} className={styles.listRow}>
                <span className={styles.listText}>
                  <span className={styles.term} lang="en">
                    {m.word.term}
                  </span>
                  <span className={styles.listMeta} lang="uk">
                    {m.word.translation}
                  </span>
                </span>
                <span className={styles.listStat}>{s.missed(m.misses, m.answers)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h3 className={styles.listTitle}>{s.lessons}</h3>
      {weak.length === 0 ? (
        <p className={styles.listEmpty}>{s.lessonsEmpty}</p>
      ) : (
        <ul className={styles.list}>
          {weak.map(({ progress, lesson }) => (
            <li key={lesson.id}>
              <Link to={`/grammar/${lesson.id}`} className={styles.listRow}>
                <span className={styles.listText}>
                  <span className={styles.listName} lang="en">
                    {lesson.title}
                  </span>
                </span>
                <span className={styles.listStat}>{s.best(progress.bestScore ?? 0)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { useT } from '@/i18n'
import { formatRelative } from '@/lib/date'
import type { Writing } from '@/lib/db/types'
import { countWords } from '../analysis'
import { activitySubject } from '../titles'
import styles from '../Writing.module.scss'

/** The learner's own pieces, newest edit first. */
export function WritingList({ writings }: { writings: Writing[] }) {
  const t = useT()
  const w = t.writing
  return (
    <ul className={styles.list}>
      {writings.map((item) => {
        // Own title, task title, or the first words of an untitled text.
        const title = activitySubject(item) || null
        return (
          <li key={item.id}>
            <Link to={`/writing/${item.id}`} className={styles.row}>
              <span className={styles.rowMain}>
                <span className={styles.rowTitle} lang={title ? 'en' : undefined}>
                  {title ?? w.untitled}
                </span>
                <span className={styles.rowText}>
                  {w.rowMeta(
                    countWords(item.text),
                    formatRelative(item.updatedAt, t.locale, t.common.justNow),
                  )}
                </span>
              </span>
              <span className={item.completedAt ? styles.statusDone : styles.status}>
                {item.completedAt && <CircleCheck aria-hidden />}
                {item.completedAt ? w.done : w.inProgress}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

import { FilePlus } from 'lucide-react'
import { Badge } from '@/components/ui'
import { WRITING_PROMPTS } from '@/content/writing'
import { useT } from '@/i18n'
import styles from '../Writing.module.scss'

/** Tasks to start from, plus a blank page. Each row starts a new piece. */
export function PromptList({ onStart }: { onStart: (promptId: string | null) => void }) {
  const w = useT().writing
  return (
    <ul className={styles.list}>
      <li>
        <button type="button" className={styles.row} onClick={() => onStart(null)}>
          <FilePlus className={styles.rowIcon} aria-hidden />
          <span className={styles.rowMain}>
            <span className={styles.rowTitleSans}>{w.freeWriting}</span>
            <span className={styles.rowText}>{w.freeWritingText}</span>
          </span>
        </button>
      </li>
      {WRITING_PROMPTS.map((p) => (
        <li key={p.id}>
          <button type="button" className={styles.row} onClick={() => onStart(p.id)}>
            <span className={styles.rowMain}>
              <span className={styles.rowMeta}>
                <Badge tone="accent">{p.level}</Badge>
                {w.kinds[p.kind]}, {w.range(p.minWords, p.maxWords)}
              </span>
              <span className={styles.rowTitle} lang="en">
                {p.title}
              </span>
              <span className={styles.rowText}>{p.task}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

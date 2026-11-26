import { useT } from '@/i18n'
import type { DiffSegment } from '../diff'
import styles from '../Writing.module.scss'

/** A version against the current text: <ins> for added words, <del> for removed ones. */
export function DiffView({ segments }: { segments: DiffSegment[] }) {
  const v = useT().writing.versions
  if (segments.every((s) => s.type === 'same')) return <p className={styles.muted}>{v.same}</p>
  return (
    <div className={styles.diff}>
      <p className={styles.diffLegend}>{v.legend}</p>
      <p className={styles.diffText} lang="en">
        {segments.map((s, i) =>
          s.type === 'added' ? (
            <ins key={i}>{s.text}</ins>
          ) : s.type === 'removed' ? (
            <del key={i}>{s.text}</del>
          ) : (
            <span key={i}>{s.text}</span>
          ),
        )}
      </p>
    </div>
  )
}

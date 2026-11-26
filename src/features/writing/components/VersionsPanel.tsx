import { useMemo, useState } from 'react'
import { History, RotateCcw } from 'lucide-react'
import { Button, Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { formatRelative } from '@/lib/date'
import type { WritingVersion } from '@/lib/db/types'
import { diffStats, diffWords } from '../diff'
import { DiffView } from './DiffView'
import styles from '../Writing.module.scss'

interface VersionsPanelProps {
  versions: WritingVersion[]
  current: string
  onRestore: (version: WritingVersion) => void
}

/** Saved versions, newest first; each can be compared with the current text or restored. */
export function VersionsPanel({ versions, current, onRestore }: VersionsPanelProps) {
  const t = useT()
  const v = t.writing.versions
  const [open, setOpen] = useState<number | null>(null)
  const newestFirst = useMemo(() => versions.toReversed(), [versions])
  // What each version changed against the one before it — depends only on the versions,
  // so typing in the editor doesn't re-diff the whole history.
  const changes = useMemo(
    () =>
      newestFirst.map((version, i) =>
        diffStats(diffWords(newestFirst[i + 1]?.text ?? '', version.text)),
      ),
    [newestFirst],
  )
  const selected = versions.find((x) => x.at === open)
  // Only the version being compared is diffed against the live text.
  const segments = useMemo(
    () => (selected ? diffWords(selected.text, current) : null),
    [selected, current],
  )

  return (
    <Card>
      <CardHeader icon={<History />} title={v.title} description={v.description} />
      {versions.length === 0 ? (
        <p className={styles.muted}>{v.empty}</p>
      ) : (
        <ol className={styles.versions}>
          {newestFirst.map((version, i) => {
            const change = changes[i] ?? { added: 0, removed: 0 }
            const isOpen = open === version.at
            return (
              <li key={version.at} className={styles.version}>
                <div className={styles.versionHead}>
                  <span>
                    <strong>{formatRelative(version.at, t.locale, t.common.justNow)}</strong>{' '}
                    <span className={styles.muted}>
                      {t.writing.words(version.words)}, {v.change(change.added, change.removed)}
                    </span>
                  </span>
                  <span className={styles.versionActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : version.at)}
                    >
                      {isOpen ? v.hide : v.compare}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<RotateCcw />}
                      onClick={() => {
                        setOpen(null)
                        onRestore(version)
                      }}
                    >
                      {v.restore}
                    </Button>
                  </span>
                </div>
                {isOpen && segments && <DiffView segments={segments} />}
              </li>
            )
          })}
        </ol>
      )}
    </Card>
  )
}

import type { RefObject } from 'react'
import { Check, CircleCheck, History, Trash2 } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { formatDate } from '@/lib/date'
import { WRITING_MAX, WRITING_TITLE_MAX } from '@/lib/db/limits'
import { lengthStatus } from '../analysis'
import type { SaveState } from '../useAutosave'
import styles from '../Writing.module.scss'

interface EditorCardProps {
  title: string
  text: string
  titlePlaceholder: string
  words: number
  range: { min: number; max: number } | null
  saveState: SaveState
  completedAt?: number
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onTitle: (title: string) => void
  onText: (text: string) => void
  onSaveVersion: () => void
  onDone: () => void
  onDelete: () => void
}

/** The page itself: title, text, live length against the task, and the main actions. */
export function EditorCard(props: EditorCardProps) {
  const t = useT()
  const w = t.writing
  const { words, range, textareaRef } = props
  const status = range ? lengthStatus(words, range.min, range.max) : null
  const hint =
    !range || !status
      ? null
      : status === 'empty'
        ? w.lengthHint.empty(range.min, range.max)
        : status === 'short'
          ? w.lengthHint.short(range.min - words)
          : status === 'long'
            ? w.lengthHint.long(words - range.max)
            : w.lengthHint.good

  return (
    <Card className={styles.editor}>
      <input
        className={styles.titleInput}
        aria-label={w.titleLabel}
        placeholder={props.titlePlaceholder}
        value={props.title}
        maxLength={WRITING_TITLE_MAX}
        onChange={(e) => props.onTitle(e.target.value)}
        lang="en"
      />
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        aria-label={w.textLabel}
        placeholder={w.placeholder}
        value={props.text}
        maxLength={WRITING_MAX}
        onChange={(e) => props.onText(e.target.value)}
        lang="en"
        spellCheck
      />
      <div className={styles.statusBar}>
        <p className={cx(styles.length, status && styles[`length-${status}`])}>
          <strong>{w.words(words)}</strong>
          {hint && <span> {hint}</span>}
        </p>
        {/* Visible only: announcing "Saved" after every pause would interrupt a screen reader. */}
        <p className={styles.saveState}>
          {props.saveState === 'saved' ? (
            <>
              <Check aria-hidden /> {w.saved}
            </>
          ) : (
            w.saving
          )}
        </p>
      </div>
      {props.completedAt && (
        <p className={styles.completed}>
          <CircleCheck aria-hidden /> {w.completedOn(formatDate(props.completedAt, t.locale))}
        </p>
      )}
      <div className={styles.actions}>
        <Button variant="primary" icon={<CircleCheck />} onClick={props.onDone} disabled={!words}>
          {w.markDone}
        </Button>
        <Button icon={<History />} onClick={props.onSaveVersion} disabled={!words}>
          {w.saveVersion}
        </Button>
        <Button
          variant="ghost"
          iconOnly
          icon={<Trash2 />}
          aria-label={w.delete}
          className={styles.deleteButton}
          onClick={props.onDelete}
        />
      </div>
    </Card>
  )
}

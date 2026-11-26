import { ClipboardList, Plus } from 'lucide-react'
import { Button, Card, CardHeader, SpeakButton } from '@/components/ui'
import type { WritingPrompt } from '@/content/writing'
import { useT } from '@/i18n'
import styles from '../Writing.module.scss'

interface TaskPanelProps {
  prompt: WritingPrompt
  checked: string[]
  onToggle: (id: string) => void
  onInsert: (phrase: string) => void
}

/**
 * What to write, phrases to insert at the cursor, and a checklist to tick before finishing.
 * Two cards: on a phone the brief sits above the editor and the tools below it (so the
 * text field is on the first screen); on desktop both stay in the side column.
 */
export function TaskPanel({ prompt, checked, onToggle, onInsert }: TaskPanelProps) {
  const w = useT().writing
  return (
    <aside className={styles.taskAside} aria-label={w.task}>
      <Card className={styles.brief}>
        <CardHeader
          icon={<ClipboardList />}
          title={w.task}
          description={w.range(prompt.minWords, prompt.maxWords)}
        />
        <p className={styles.taskText}>{prompt.task}</p>
      </Card>
      <Card className={styles.tools}>
        <h3 className={styles.toolsTitle}>{w.phrases}</h3>
        <ul className={styles.phrases}>
          {prompt.phrases.map((p) => (
            <li key={p.en} className={styles.phrase}>
              <span className={styles.phraseText}>
                <span lang="en">{p.en}</span>
                <span className={styles.phraseUk} lang="uk">
                  {p.uk}
                </span>
              </span>
              <SpeakButton text={p.en.replace(/…/g, '')} />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                icon={<Plus />}
                aria-label={w.insert(p.en)}
                onClick={() => onInsert(p.en)}
              />
            </li>
          ))}
        </ul>

        <h3 className={styles.subTitle}>{w.checklist}</h3>
        <ul className={styles.checklist}>
          {prompt.checklist.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={checked.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                />
                <span>{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  )
}

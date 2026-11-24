import { Play } from 'lucide-react'
import { Button, Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import { QUIZ_SOURCES, type QuizConfig } from '@/lib/db/types'
import { presetConfig, PRESET_SIZE } from '../generate'
import styles from '../Quizzes.module.scss'

/** One-tap quizzes: one surface, a row per kind of quiz. */
export function QuickQuizzes({ onStart }: { onStart: (config: QuizConfig) => void }) {
  const q = useT().quizzes
  return (
    <Card padding="none">
      <div className={styles.cardPad}>
        <CardHeader icon={<Play />} title={q.quickTitle} />
      </div>
      <ul className={styles.rows}>
        {QUIZ_SOURCES.map((source) => (
          <li key={source} className={styles.row}>
            <div className={styles.rowText}>
              <p className={styles.rowTitle}>{q.presets[source].title}</p>
              <p className={styles.rowMeta}>
                {q.presets[source].text} {q.questions(PRESET_SIZE)}.
              </p>
            </div>
            <Button size="sm" onClick={() => onStart(presetConfig(source))}>
              {q.start}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

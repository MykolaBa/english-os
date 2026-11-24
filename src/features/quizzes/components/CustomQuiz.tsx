import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button, Card, CardHeader, Chip, SelectField } from '@/components/ui'
import { useT } from '@/i18n'
import {
  QUIZ_SOURCES,
  VOCAB_KINDS,
  type QuizConfig,
  type QuizSource,
  type VocabKind,
} from '@/lib/db/types'
import { newSeed } from '@/lib/exercises/random'
import { useCollections } from '@/features/vocabulary/hooks'
import { buildQuiz, QUIZ_SIZES, type QuizData } from '../generate'
import styles from '../Quizzes.module.scss'

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item]

export function CustomQuiz({
  data,
  onStart,
}: {
  data: QuizData
  onStart: (config: QuizConfig) => void
}) {
  const q = useT().quizzes
  const collections = useCollections()
  const [source, setSource] = useState<QuizSource>('mixed')
  const [collectionId, setCollectionId] = useState('')
  const [lessonIds, setLessonIds] = useState<string[]>([])
  const [vocabKinds, setVocabKinds] = useState<VocabKind[]>([])
  const [count, setCount] = useState('10')
  // One seed for the preview and the start, so "N questions ready" matches what you get.
  const [seed, setSeed] = useState(newSeed)

  const config = useMemo<QuizConfig>(
    () => ({
      source,
      count: Number(count),
      collectionId: collectionId || null,
      lessonIds,
      vocabKinds,
      seed,
    }),
    [source, count, collectionId, lessonIds, vocabKinds, seed],
  )
  const ready = useMemo(() => buildQuiz(config, data).length, [config, data])
  const usesWords = source !== 'grammar'
  const usesLessons = source === 'grammar' || source === 'mixed'

  return (
    <Card>
      <CardHeader icon={<SlidersHorizontal />} title={q.customTitle} description={q.customText} />
      <div className={styles.form}>
        <div className={styles.formRow}>
          <SelectField<QuizSource>
            label={q.source}
            value={source}
            onChange={setSource}
            options={QUIZ_SOURCES.map((s) => ({ value: s, label: q.sources[s] }))}
          />
          <SelectField<string>
            label={q.count}
            value={count}
            onChange={setCount}
            options={QUIZ_SIZES.map((n) => ({ value: String(n), label: q.questions(n) }))}
          />
        </div>
        {usesWords && source !== 'mistakes' && (
          <SelectField<string>
            label={q.collection}
            value={collectionId}
            onChange={setCollectionId}
            options={[
              { value: '', label: q.allWords },
              ...(collections ?? []).map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        )}
        {usesWords && (
          <fieldset className={styles.fieldset}>
            <legend>{q.kinds}</legend>
            <div className={styles.chips}>
              {VOCAB_KINDS.map((kind) => (
                <Chip
                  key={kind}
                  selected={vocabKinds.includes(kind)}
                  onClick={() => setVocabKinds(toggle(vocabKinds, kind))}
                >
                  {q.kindLabels[kind]}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}
        {usesLessons && (
          <fieldset className={styles.fieldset}>
            <legend>{q.lessons}</legend>
            <div className={styles.chips}>
              <Chip selected={lessonIds.length === 0} onClick={() => setLessonIds([])}>
                {q.allLessons}
              </Chip>
              {data.lessons.map((lesson) => (
                <Chip
                  key={lesson.id}
                  selected={lessonIds.includes(lesson.id)}
                  onClick={() => setLessonIds(toggle(lessonIds, lesson.id))}
                >
                  {lesson.title}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}
        <p className={styles.ready}>{ready > 0 ? q.available(ready) : q.notEnough}</p>
        <div>
          <Button
            variant="primary"
            disabled={ready === 0}
            onClick={() => {
              onStart(config)
              setSeed(newSeed()) // next quiz gets fresh questions
            }}
          >
            {q.startCustom}
          </Button>
        </div>
      </div>
    </Card>
  )
}

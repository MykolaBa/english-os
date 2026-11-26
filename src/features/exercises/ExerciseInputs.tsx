import { useMemo } from 'react'
import { cx } from '@/lib/cx'
import { orderTiles } from '@/lib/exercises/check'
import type { ChoiceExercise, OrderExercise } from '@/lib/exercises/types'
import { useT } from '@/i18n'
import { Button } from '@/components/ui'
import styles from './Exercises.module.scss'

interface ChoiceInputProps {
  exercise: ChoiceExercise
  selected: number | null
  /** After checking: highlight the right option and the wrong pick. */
  revealed: boolean
  onSelect: (index: number) => void
}

export function ChoiceInput({ exercise, selected, revealed, onSelect }: ChoiceInputProps) {
  return (
    <div className={styles.choices} role="group">
      {exercise.options.map((option, i) => (
        <button
          key={option}
          type="button"
          lang={exercise.optionsLang ?? 'en'}
          className={cx(
            styles.choice,
            selected === i && styles.choiceSelected,
            revealed && i === exercise.answer && styles.choiceRight,
            revealed && selected === i && i !== exercise.answer && styles.choiceWrong,
          )}
          aria-pressed={selected === i}
          disabled={revealed}
          onClick={() => onSelect(i)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

interface OrderInputProps {
  exercise: OrderExercise
  /** Indices into the shuffled tiles, in the order the learner picked them. */
  picked: number[]
  revealed: boolean
  onChange: (picked: number[]) => void
}

export function OrderInput({ exercise, picked, revealed, onChange }: OrderInputProps) {
  const t = useT().exercises
  // Stable per exercise: the tiles don't jump around between renders.
  const tiles = useMemo(() => orderTiles(exercise), [exercise])
  return (
    <div className={styles.order}>
      <p className={styles.hint}>{t.tapWords}</p>
      <div className={styles.sentence} aria-live="polite" lang="en">
        {picked.map((tileIndex, position) => (
          <button
            key={`${tileIndex}-${position}`}
            type="button"
            className={styles.tile}
            disabled={revealed}
            onClick={() => onChange(picked.filter((_, p) => p !== position))}
          >
            {tiles[tileIndex]}
          </button>
        ))}
      </div>
      <div className={styles.tiles} lang="en">
        {tiles.map((word, i) => (
          <button
            key={`${word}-${i}`}
            type="button"
            className={cx(styles.tile, picked.includes(i) && styles.tileUsed)}
            disabled={revealed || picked.includes(i)}
            onClick={() => onChange([...picked, i])}
          >
            {word}
          </button>
        ))}
      </div>
      {picked.length > 0 && !revealed && (
        <Button variant="ghost" size="sm" onClick={() => onChange([])}>
          {t.clear}
        </Button>
      )}
    </div>
  )
}

interface TextAnswerProps {
  value: string
  onChange: (value: string) => void
  /** null before checking; then whether the answer was right. */
  correct: boolean | null
  label: string
}

/** The typed answer of gap and transform exercises. */
export function TextAnswer({ value, onChange, correct, label }: TextAnswerProps) {
  return (
    <input
      className={cx(
        styles.answer,
        correct === true && styles.answerRight,
        correct === false && styles.answerWrong,
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={correct !== null}
      aria-label={label}
      placeholder={label}
      lang="en"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="done"
      // The single field of this step; focusing it is what the learner wants.
      autoFocus
    />
  )
}

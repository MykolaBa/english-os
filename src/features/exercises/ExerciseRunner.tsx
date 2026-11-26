import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, ProgressBar } from '@/components/ui'
import { useT } from '@/i18n'
import {
  checkExercise,
  orderedSentence,
  type AttemptResult,
  type CheckResult,
} from '@/lib/exercises/check'
import type { Exercise, ExerciseResponse } from '@/lib/exercises/types'
import { ExerciseFeedback } from './ExerciseFeedback'
import { ListenButtons } from './ListenButtons'
import { ChoiceInput, OrderInput, TextAnswer } from './ExerciseInputs'
import { ExerciseResult } from './ExerciseResult'
import styles from './Exercises.module.scss'

interface ExerciseRunnerProps {
  exercises: readonly Exercise[]
  /** Score that completes a lesson; omit for quizzes (no pass/fail message). */
  passScore?: number
  /** Called once when the last exercise is answered (save progress, XP…). */
  onComplete: (result: AttemptResult) => void
  onClose: () => void
}

/** Plays a list of exercises one by one: answer → check → explanation → next → result. */
export function ExerciseRunner({ exercises, passScore, onComplete, onClose }: ExerciseRunnerProps) {
  const t = useT().exercises
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [choice, setChoice] = useState<number | null>(null)
  const [picked, setPicked] = useState<number[]>([])
  const [checked, setChecked] = useState<CheckResult | null>(null)
  const [mistakes, setMistakes] = useState<string[]>([])
  const [result, setResult] = useState<AttemptResult | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // After checking, move focus to "Continue" so Enter / Space keeps the flow going
  // (a clicked option becomes disabled and would otherwise drop focus to <body>).
  useEffect(() => {
    if (checked) formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus()
  }, [checked])

  /** Clears everything that belongs to the exercise on screen. */
  const resetStep = () => {
    setText('')
    setChoice(null)
    setPicked([])
    setChecked(null)
  }

  const exercise = exercises[index]
  if (result) {
    return (
      <ExerciseResult
        result={result}
        exercises={exercises}
        passScore={passScore}
        onRetry={() => {
          setIndex(0)
          setMistakes([])
          setResult(null)
          resetStep()
        }}
        onClose={onClose}
      />
    )
  }
  if (!exercise) return null

  const response: ExerciseResponse | null =
    exercise.type === 'choice'
      ? choice
      : exercise.type === 'order'
        ? orderedSentence(exercise, picked)
        : text
  const canCheck = response !== null && response !== ''

  const check = (value: ExerciseResponse = response ?? '') => {
    const outcome = checkExercise(exercise, value)
    setChecked(outcome)
    if (!outcome.correct) setMistakes((m) => [...m, exercise.id])
  }

  const next = () => {
    if (index === exercises.length - 1) {
      const final = {
        correct: exercises.length - mistakes.length,
        total: exercises.length,
        mistakes,
      }
      setResult(final)
      onComplete(final)
      return
    }
    setIndex(index + 1)
    resetStep()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (checked) next()
    else if (canCheck) check()
  }

  return (
    <form ref={formRef} className={styles.runner} onSubmit={submit} aria-label={t.label}>
      <div className={styles.runnerHeader}>
        <ProgressBar value={index / exercises.length} label={t.label} size="sm" />
        <span>{t.progress(index + 1, exercises.length)}</span>
      </div>

      <p className={styles.task}>
        {exercise.type === 'transform' ? exercise.instruction : t.types[exercise.type]}
      </p>
      {exercise.audio && <ListenButtons key={`${exercise.id}:audio`} text={exercise.audio} />}
      {exercise.type !== 'order' && (
        <p className={styles.prompt} lang={exercise.promptLang ?? 'en'}>
          {exercise.prompt}
        </p>
      )}
      {(exercise.type === 'order' || exercise.type === 'gap') && exercise.translation && (
        <p className={styles.translation} lang="uk">
          {exercise.translation}
        </p>
      )}

      {exercise.type === 'choice' && (
        <ChoiceInput
          exercise={exercise}
          selected={choice}
          revealed={checked !== null}
          onSelect={(i) => {
            setChoice(i)
            check(i) // a click is the answer — no separate "check" step
          }}
        />
      )}
      {(exercise.type === 'gap' || exercise.type === 'transform') && (
        <TextAnswer
          key={exercise.id}
          value={text}
          onChange={setText}
          correct={checked ? checked.correct : null}
          label={t.answerLabel}
        />
      )}
      {exercise.type === 'order' && (
        <OrderInput
          exercise={exercise}
          picked={picked}
          revealed={checked !== null}
          onChange={setPicked}
        />
      )}

      {checked && <ExerciseFeedback exercise={exercise} checked={checked} />}

      <div className={styles.actions}>
        {checked ? (
          <Button type="submit" variant="primary" size="lg">
            {index === exercises.length - 1 ? t.finish : t.continue}
          </Button>
        ) : (
          exercise.type !== 'choice' && (
            <Button type="submit" variant="primary" size="lg" disabled={!canCheck}>
              {t.check}
            </Button>
          )
        )}
      </div>
    </form>
  )
}

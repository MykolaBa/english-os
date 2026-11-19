import { useState, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import type { ReviewRating, Word } from '@/lib/db/types'
import { speak } from '@/lib/speech'
import { checkAnswer, maskTerm, type AnswerVerdict } from '../answer'
import { Headword, WordDetails } from './WordFace'
import styles from '../Review.module.scss'

/** Verdicts map onto the same four ratings as flashcards. */
const RATING_FOR: Record<AnswerVerdict, ReviewRating> = {
  correct: 'good',
  typo: 'hard',
  wrong: 'again',
}

interface TypingCardProps {
  word: Word
  showTranslations: boolean
  autoPronounce: boolean
  busy: boolean
  onAnswer: (rating: ReviewRating) => void
}

/** Mount with `key={word.id}` so the input resets for every word. */
export function TypingCard({
  word,
  showTranslations,
  autoPronounce,
  busy,
  onAnswer,
}: TypingCardProps) {
  const t = useT()
  const s = t.review.session
  const [input, setInput] = useState('')
  const [verdict, setVerdict] = useState<AnswerVerdict | null>(null)
  const hint = word.example ? maskTerm(word.example, word.term) : null

  const finish = (result: AnswerVerdict) => {
    setVerdict(result)
    if (autoPronounce) speak(word.term)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (verdict) return onAnswer(RATING_FOR[verdict])
    if (input.trim()) finish(checkAnswer(input, word.term))
  }

  return (
    <div className={styles.cardStage}>
      <article className={styles.card}>
        <p className={styles.typePrompt}>{s.typePrompt}</p>
        <div className={styles.promptBlock}>
          <p className={styles.prompt} lang="uk">
            {word.translation}
          </p>
          {word.partOfSpeech && (
            <p className={styles.promptPos}>{t.partOfSpeech[word.partOfSpeech]}</p>
          )}
        </div>
        {hint && (
          <p className={styles.hint} lang="en">
            {hint}
          </p>
        )}

        <form className={styles.typeForm} onSubmit={submit}>
          <label className="visually-hidden" htmlFor="review-answer">
            {s.typeLabel}
          </label>
          <input
            id="review-answer"
            className={cx(styles.typeInput, verdict && styles[verdict])}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            readOnly={verdict !== null}
            placeholder={s.typeLabel}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            lang="en"
            enterKeyHint="done"
            // The first field of the session screen; focusing it is the point of this mode.
            autoFocus
          />
          {verdict === null ? (
            <div className={styles.typeActions}>
              <Button type="button" variant="ghost" onClick={() => finish('wrong')}>
                {s.reveal}
              </Button>
              <Button type="submit" variant="primary" disabled={!input.trim()}>
                {s.check}
              </Button>
            </div>
          ) : (
            <>
              <p className={cx(styles.verdict, styles[verdict])} role="status">
                {verdict === 'wrong' ? <X aria-hidden /> : <Check aria-hidden />}
                {s[verdict]}
              </p>
              <Headword word={word} />
              <WordDetails word={word} showTranslations={showTranslations} hideTranslation />
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={busy}>
                {s.continue}
              </Button>
            </>
          )}
        </form>
      </article>
    </div>
  )
}

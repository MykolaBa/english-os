import { useEffect, useEffectEvent, useReducer, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Button, ProgressBar } from '@/components/ui'
import { useT } from '@/i18n'
import type { ReviewRating, Word } from '@/lib/db/types'
import { speak } from '@/lib/speech'
import { useSettings, type ReviewMode } from '@/stores/settingsStore'
import { toast } from '@/stores/toastStore'
import { previewIntervals } from '@/lib/srs/scheduler'
import { recordAnswer } from '../reviewRepo'
import {
  completedCount,
  currentWord,
  sessionReducer,
  startSession,
  type SessionKind,
  type SessionState,
} from '../session'
import { Flashcard } from './Flashcard'
import { RatingBar } from './RatingBar'
import { TypingCard } from './TypingCard'
import styles from '../Review.module.scss'

const RATING_KEYS: Record<string, ReviewRating> = {
  '1': 'again',
  '2': 'hard',
  '3': 'good',
  '4': 'easy',
}

interface ReviewSessionProps {
  words: Word[]
  mode: ReviewMode
  kind: SessionKind
  onFinish: (state: SessionState) => void
}

export function ReviewSession({ words, mode, kind, onFinish }: ReviewSessionProps) {
  const t = useT()
  const s = t.review.session
  const srsConfig = useSettings((st) => st.srs)
  const showTranslations = useSettings((st) => st.showTranslations)
  const autoPronounce = useSettings((st) => st.autoPronounce)
  const [state, dispatch] = useReducer(sessionReducer, words, (w) => startSession(w, Date.now()))
  const [busy, setBusy] = useState(false)
  const shownAt = useRef(0)

  const word = currentWord(state)
  // New words are always met as a flashcard first — you can't type a word you've never seen.
  const typing = mode === 'typing' && word !== undefined && word.srs.status !== 'new'
  const direction = mode === 'reverse' ? 'uk-en' : 'en-uk'
  const canRate = !typing && state.revealed && !busy

  // A new card is on screen: start its timer and, if enabled, say the English side.
  // `cardKey` changes per card shown (a word answered "again" comes back as a new card).
  const cardKey = word ? `${word.id}:${state.answers.length}` : null
  const onCardShown = useEffectEvent(() => {
    shownAt.current = Date.now()
    if (word && autoPronounce && direction === 'en-uk' && !typing) speak(word.term)
  })
  useEffect(() => {
    if (cardKey) onCardShown()
  }, [cardKey])

  useEffect(() => {
    if (!word) onFinish(state)
  }, [word, state, onFinish])

  const reveal = () => {
    dispatch({ type: 'reveal' })
    if (autoPronounce && direction === 'uk-en' && word) speak(word.term)
  }

  const answer = async (rating: ReviewRating) => {
    if (!word || busy) return
    setBusy(true)
    try {
      const updated = await recordAnswer({
        wordId: word.id,
        rating,
        mode,
        config: srsConfig,
        durationMs: Date.now() - shownAt.current,
        practice: kind === 'practice',
      })
      dispatch({ type: 'answered', rating, word: updated })
    } catch (err) {
      toast.error(t.errors.title, String(err))
    } finally {
      setBusy(false)
    }
  }

  // Keyboard: Space/Enter reveals, 1–4 rate, Escape ends. Ignored while typing an answer.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key === 'Escape') return onFinish(state)
    if (typing) return
    if (!state.revealed && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault()
      reveal()
    } else if (canRate && RATING_KEYS[e.key]) {
      e.preventDefault()
      void answer(RATING_KEYS[e.key]!)
    }
  })
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!word) return null
  const done = completedCount(state)

  return (
    <section className={styles.session} aria-label={s.label}>
      <header className={styles.sessionHeader}>
        <ProgressBar value={state.total ? done / state.total : 0} label={s.label} size="sm" />
        <span className={styles.sessionCount}>{s.progress(done, state.total)}</span>
        <Button variant="ghost" size="sm" icon={<X />} onClick={() => onFinish(state)}>
          {s.end}
        </Button>
      </header>
      {kind === 'practice' && <p className={styles.practiceBanner}>{s.practiceLabel}</p>}

      {typing ? (
        <TypingCard
          key={cardKey}
          word={word}
          showTranslations={showTranslations}
          autoPronounce={autoPronounce}
          busy={busy}
          onAnswer={(rating) => void answer(rating)}
        />
      ) : (
        <>
          <Flashcard
            word={word}
            direction={direction}
            revealed={state.revealed}
            showTranslations={showTranslations}
            onReveal={reveal}
          />
          {state.revealed && (
            <RatingBar
              preview={kind === 'practice' ? null : previewIntervals(word.srs, srsConfig)}
              disabled={busy}
              onRate={(r) => void answer(r)}
            />
          )}
        </>
      )}
      {!typing && <p className={styles.shortcuts}>{s.shortcuts}</p>}
    </section>
  )
}

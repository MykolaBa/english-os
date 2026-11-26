import { useEffect } from 'react'
import { Snail, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useT } from '@/i18n'
import { isSpeechSupported, speak, stopSpeaking } from '@/lib/speech'
import styles from './Exercises.module.scss'

/**
 * For exercises you answer by ear (dictation): plays the sentence once when it appears,
 * and again on demand, at normal or slow speed. Mount it keyed by the exercise.
 */
export function ListenButtons({ text }: { text: string }) {
  const t = useT().exercises
  useEffect(() => {
    speak(text, 0.9)
    return stopSpeaking
  }, [text])
  if (!isSpeechSupported()) return null
  return (
    <div className={styles.listen}>
      <Button size="sm" icon={<Volume2 />} onClick={() => speak(text, 0.9)}>
        {t.listen}
      </Button>
      <Button size="sm" variant="ghost" icon={<Snail />} onClick={() => speak(text, 0.65)}>
        {t.listenSlow}
      </Button>
    </div>
  )
}

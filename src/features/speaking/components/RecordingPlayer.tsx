import { useEffect, useRef } from 'react'
import styles from '../Speaking.module.scss'

/**
 * Plays a recording stored as a Blob. The object URL is created and revoked with the
 * Blob (an effect syncing the <audio> element), so played recordings don't stay in memory.
 */
export function RecordingPlayer({ audio, label }: { audio: Blob; label: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const url = URL.createObjectURL(audio)
    el.src = url
    return () => {
      el.removeAttribute('src')
      el.load()
      URL.revokeObjectURL(url)
    }
  }, [audio])
  return (
    <audio ref={ref} className={styles.player} controls preload="metadata" aria-label={label} />
  )
}

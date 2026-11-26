import { MicOff } from 'lucide-react'
import { useT } from '@/i18n'
import type { RecorderStatus } from '../useRecorder'
import styles from '../Speaking.module.scss'

/** Explains, in plain words, why recording isn't possible right now. */
export function MicProblem({ status }: { status: RecorderStatus }) {
  const p = useT().speaking.problems
  const text =
    status === 'unsupported'
      ? p.unsupported
      : status === 'denied'
        ? p.denied
        : status === 'noMicrophone'
          ? p.noMicrophone
          : status === 'error'
            ? p.error
            : null
  if (!text) return null
  return (
    <p className={styles.problem} role="alert">
      <MicOff aria-hidden /> {text}
    </p>
  )
}

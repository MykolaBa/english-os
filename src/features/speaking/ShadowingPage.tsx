import { useCallback, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { BackLink, NotFoundCard, Skeleton } from '@/components/ui'
import { getShadowingSet, type ShadowingSet } from '@/content/speaking'
import { useT } from '@/i18n'
import { RECORDING_MAX_MS } from '@/lib/db/limits'
import { toast } from '@/stores/toastStore'
import { MicProblem } from './components/MicProblem'
import { SentenceRow } from './components/SentenceRow'
import { useRecordings } from './hooks'
import { rateRecording, saveRecording, speakingXp } from './speakingRepo'
import { useRecorder, type RecordingResult } from './useRecorder'
import styles from './Speaking.module.scss'

export default function ShadowingPage() {
  const { setId } = useParams()
  const set = setId ? getShadowingSet(setId) : undefined
  const s = useT().speaking
  return (
    <div className={styles.page}>
      <BackLink to="/speaking">{s.back}</BackLink>
      {set ? (
        <ShadowingSetView key={set.id} set={set} />
      ) : (
        <NotFoundCard title={s.notFoundTitle} description={s.notFoundText} />
      )}
    </div>
  )
}

/** One recorder for the whole page: only one sentence can be recorded at a time. */
function ShadowingSetView({ set }: { set: ShadowingSet }) {
  const t = useT()
  const s = t.speaking
  const ids = useMemo(() => set.sentences.map((x) => x.id), [set])
  const takes = useRecordings(ids)
  const [activeId, setActiveId] = useState<string | null>(null)
  // The sentence being recorded, read when the recording finishes.
  const recordingFor = useRef<string | null>(null)

  const onDone = useCallback(
    (result: RecordingResult) => {
      const itemId = recordingFor.current
      if (!itemId) return
      void saveRecording({ kind: 'shadowing', itemId, ...result }, set.title)
        .then(() => toast.success(s.saved(speakingXp('shadowing', result.durationMs))))
        .catch((err: unknown) => toast.error(t.errors.title, String(err)))
    },
    [set.title, s, t.errors.title],
  )
  const recorder = useRecorder(RECORDING_MAX_MS, onDone)

  const record = (id: string) => {
    recordingFor.current = id
    setActiveId(id)
    void recorder.start()
  }

  return (
    <>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle} lang="en">
          {set.title}
        </h1>
        <p className={styles.focus}>{set.focus}</p>
      </header>
      <MicProblem status={recorder.status} />
      {!takes ? (
        <Skeleton height={400} />
      ) : (
        <ol className={styles.sentences}>
          {set.sentences.map((sentence) => {
            const latest = takes.get(sentence.id)?.[0]
            return (
              <SentenceRow
                key={sentence.id}
                sentence={sentence}
                latest={latest}
                recorder={{
                  status: recorder.status,
                  level: recorder.level,
                  active: activeId === sentence.id,
                }}
                onRecord={() => record(sentence.id)}
                onStop={recorder.stop}
                onRate={(rating) =>
                  latest &&
                  void rateRecording(latest.id, rating).catch((err: unknown) =>
                    toast.error(t.errors.title, String(err)),
                  )
                }
              />
            )
          })}
        </ol>
      )}
      <p className={styles.privacy}>{s.privacy}</p>
    </>
  )
}

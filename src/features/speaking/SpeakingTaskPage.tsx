import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import { BackLink, Badge, Card, NotFoundCard, Skeleton, SpeakButton } from '@/components/ui'
import { getSpeakingTask, type SpeakingTask } from '@/content/speaking'
import { useT } from '@/i18n'
import { RECORDING_MAX_MS } from '@/lib/db/limits'
import { toast } from '@/stores/toastStore'
import { MicProblem } from './components/MicProblem'
import { RecordButton } from './components/RecordButton'
import { RecordingTimer } from './components/RecordingTimer'
import { TakeList } from './components/TakeList'
import { useRecordings } from './hooks'
import { saveRecording, speakingXp } from './speakingRepo'
import { useRecorder, type RecordingResult } from './useRecorder'
import styles from './Speaking.module.scss'

export default function SpeakingTaskPage() {
  const { taskId } = useParams()
  const task = taskId ? getSpeakingTask(taskId) : undefined
  const s = useT().speaking
  return (
    <div className={styles.page}>
      <BackLink to="/speaking">{s.back}</BackLink>
      {task ? (
        <TaskView key={task.id} task={task} />
      ) : (
        <NotFoundCard title={s.notFoundTitle} description={s.notFoundText} />
      )}
    </div>
  )
}

function TaskView({ task }: { task: SpeakingTask }) {
  const t = useT()
  const s = t.speaking
  const ids = useMemo(() => [task.id], [task.id])
  const takes = useRecordings(ids)
  const onDone = useCallback(
    (result: RecordingResult) =>
      void saveRecording({ kind: 'task', itemId: task.id, ...result }, task.title)
        .then(() => toast.success(s.saved(speakingXp('task', result.durationMs))))
        .catch((err: unknown) => toast.error(t.errors.title, String(err))),
    [task, s, t.errors.title],
  )
  const recorder = useRecorder(RECORDING_MAX_MS, onDone)
  const recording = recorder.status === 'recording'

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.heroMeta}>
          <Badge tone="accent">{task.level}</Badge> {s.minutes(task.seconds)}
        </p>
        <h1 className={styles.heroTitle} lang="en">
          {task.title}
        </h1>
        <p className={styles.focus}>{task.prompt}</p>
      </header>

      <div className={styles.taskLayout}>
        <Card className={styles.recordCard}>
          <MicProblem status={recorder.status} />
          <RecordButton
            size="lg"
            status={recorder.status}
            active
            level={recorder.level}
            onStart={() => void recorder.start()}
            onStop={recorder.stop}
          />
          {recording && <RecordingTimer seconds={task.seconds} />}
          <h2 className={styles.subTitle}>{s.plan}</h2>
          <ol className={styles.points} lang="en">
            {task.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
        </Card>
        <Card>
          <h2 className={styles.subTitle}>{s.phrases}</h2>
          <ul className={styles.phrases}>
            {task.phrases.map((p) => (
              <li key={p.en}>
                <span lang="en">{p.en}</span> <SpeakButton text={p.en.replace(/…/g, '')} />
                <span className={styles.phraseUk} lang="uk">
                  {p.uk}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {!takes ? <Skeleton height={160} /> : <TakeList takes={takes.get(task.id) ?? []} />}
      <p className={styles.privacy}>{s.privacy}</p>
    </>
  )
}

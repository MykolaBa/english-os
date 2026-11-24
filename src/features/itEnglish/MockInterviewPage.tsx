import { useState } from 'react'
import { X } from 'lucide-react'
import { BackLink, Button } from '@/components/ui'
import { INTERVIEW_QUESTIONS, type InterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import { newSeed } from '@/lib/exercises/random'
import { toast } from '@/stores/toastStore'
import { MockQuestion } from './components/MockQuestion'
import { MockSetup, type MockSettings } from './components/MockSetup'
import { MockSummary } from './components/MockSummary'
import { recordMockInterview } from './itRepo'
import { pickMockQuestions } from './mock'
import styles from './ItEnglish.module.scss'

type Stage =
  | { name: 'setup' }
  | { name: 'running'; questions: InterviewQuestion[]; times: number[] }
  | { name: 'done'; questions: InterviewQuestion[]; times: number[] }

export default function MockInterviewPage() {
  const t = useT()
  const m = t.itEnglish.mock
  const [settings, setSettings] = useState<MockSettings>({ kind: 'all', size: 5, readAloud: true })
  const [stage, setStage] = useState<Stage>({ name: 'setup' })

  const finish = (questions: InterviewQuestion[], times: number[]) => {
    setStage({ name: 'done', questions, times })
    void recordMockInterview(times.length).catch((err) => toast.error(t.errors.title, String(err)))
  }

  const start = () => {
    const questions = pickMockQuestions(
      INTERVIEW_QUESTIONS,
      settings.kind,
      settings.size,
      newSeed(),
    )
    if (questions.length === 0) return
    setStage({ name: 'running', questions, times: [] })
  }

  const current = stage.name === 'running' ? stage.questions[stage.times.length] : undefined

  return (
    <article className={styles.page}>
      <BackLink to="/it-english">{t.itEnglish.back}</BackLink>
      <header className={styles.mockHeader}>
        <h1 className={styles.pageTitle}>{m.title}</h1>
        {stage.name === 'running' && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X />}
            onClick={() => finish(stage.questions, stage.times)}
          >
            {m.end}
          </Button>
        )}
      </header>

      {stage.name === 'setup' && (
        <MockSetup settings={settings} onChange={setSettings} onStart={start} />
      )}
      {stage.name === 'running' && current && (
        <MockQuestion
          key={stage.times.length}
          question={current}
          position={stage.times.length + 1}
          total={stage.questions.length}
          readAloud={settings.readAloud}
          onNext={(seconds) => {
            const times = [...stage.times, seconds]
            if (times.length === stage.questions.length) finish(stage.questions, times)
            else setStage({ ...stage, times })
          }}
        />
      )}
      {stage.name === 'done' && (
        <MockSummary
          questions={stage.questions}
          times={stage.times}
          onAgain={() => setStage({ name: 'setup' })}
        />
      )}
    </article>
  )
}

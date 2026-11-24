import { useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { Button, Switch, TextAreaField } from '@/components/ui'
import type { InterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import type { InterviewAnswer } from '@/lib/db/types'
import { toast } from '@/stores/toastStore'
import { saveInterviewAnswer } from '../itRepo'
import styles from '../ItEnglish.module.scss'

interface AnswerEditorProps {
  question: InterviewQuestion
  saved: InterviewAnswer | null
}

/** The learner's own answer, kept in the database so it's ready before a real interview. */
export function AnswerEditor({ question, saved }: AnswerEditorProps) {
  const t = useT()
  const s = t.itEnglish
  const [draft, setDraft] = useState(saved?.answer ?? '')
  const [busy, setBusy] = useState(false)
  const dirty = draft.trim() !== (saved?.answer ?? '').trim()

  const save = async (change: Parameters<typeof saveInterviewAnswer>[2], message?: string) => {
    setBusy(true)
    try {
      await saveInterviewAnswer(question.id, question.question, change)
      if (message) toast.success(message)
    } catch (err) {
      toast.error(t.errors.title, String(err))
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void save({ answer: draft.trim() }, s.answerSaved)
  }

  return (
    <form className={styles.panel} onSubmit={submit}>
      <h2 className={styles.sectionTitle}>{s.yourAnswer}</h2>
      <TextAreaField
        label={s.yourAnswerLabel}
        hint={s.yourAnswerHint}
        rows={6}
        lang="en"
        value={draft}
        maxLength={20_000}
        onChange={(e) => setDraft(e.target.value)}
        className={styles.answerInput}
      />
      <div className={styles.answerActions}>
        <Button type="submit" variant="primary" icon={<Save />} disabled={!dirty || busy}>
          {s.saveAnswer}
        </Button>
      </div>
      <div className={styles.confident}>
        <Switch
          label={s.confident}
          description={s.confidentHint}
          checked={saved?.status === 'confident'}
          onChange={(checked) =>
            void save({ status: checked ? 'confident' : 'practising', answer: draft.trim() })
          }
        />
      </div>
    </form>
  )
}

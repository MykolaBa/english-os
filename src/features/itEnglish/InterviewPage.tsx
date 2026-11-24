import { Lightbulb, SearchX } from 'lucide-react'
import { useParams } from 'react-router'
import { Badge, Card, EmptyState, Skeleton, SpeakButton } from '@/components/ui'
import { getInterviewQuestion } from '@/content/it'
import { useT } from '@/i18n'
import { AnswerEditor } from './components/AnswerEditor'
import { BackLink } from './components/BackLink'
import { ModelAnswer } from './components/ModelAnswer'
import { useInterviewAnswer } from './hooks'
import styles from './ItEnglish.module.scss'

export default function InterviewPage() {
  const { questionId } = useParams()
  const question = questionId ? getInterviewQuestion(questionId) : undefined
  const loaded = useInterviewAnswer(question?.id)
  // A live query can briefly return the previous question's row after the id changes.
  const saved = loaded && loaded.questionId !== question?.id ? undefined : loaded
  const s = useT().itEnglish

  if (!question) {
    return (
      <div className={styles.page}>
        <BackLink />
        <Card padding="lg">
          <EmptyState icon={<SearchX />} title={s.notFoundTitle} description={s.notFoundText} />
        </Card>
      </div>
    )
  }

  return (
    <article className={styles.page}>
      <BackLink />
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <Badge tone="accent">{question.level}</Badge>
          <span>{s.kinds[question.kind]}</span>
        </div>
        <div className={styles.questionLine}>
          <h1 className={styles.heroTitle} lang="en">
            {question.question}
          </h1>
          <SpeakButton text={question.question} size="md" />
        </div>
      </header>
      <aside className={styles.tip}>
        <Lightbulb aria-hidden />
        <div>
          <h2 className={styles.tipTitle}>{s.tipTitle}</h2>
          <p>{question.tip}</p>
        </div>
      </aside>
      {saved === undefined ? (
        <Skeleton height={260} />
      ) : (
        // Keyed by question: the draft starts from the saved answer of *this* question.
        <AnswerEditor key={question.id} question={question} saved={saved} />
      )}
      <ModelAnswer question={question} />
    </article>
  )
}

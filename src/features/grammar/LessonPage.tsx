import { useEffect } from 'react'
import { Bookmark, BookmarkCheck, CircleCheck } from 'lucide-react'
import { useParams } from 'react-router'
import { BackLink, Badge, Button, ButtonLink, NotFoundCard } from '@/components/ui'
import { GRAMMAR_LESSONS, getLesson } from '@/content/grammar'
import { useT } from '@/i18n'
import { LessonSections } from './components/LessonSections'
import { LessonStatus } from './components/LessonStatus'
import { PracticePanel } from './components/PracticePanel'
import { useProgress } from './hooks'
import { markOpened, setCompleted, toggleBookmark } from './progressRepo'
import styles from './Grammar.module.scss'

export default function LessonPage() {
  const { lessonId } = useParams()
  const lesson = lessonId ? getLesson(lessonId) : undefined
  const progress = useProgress(lesson?.id)
  const t = useT()
  const g = t.grammar
  const l = g.lesson

  // Opening a lesson marks it as started (syncs with the database, hence an effect).
  useEffect(() => {
    if (lesson) void markOpened(lesson.id)
  }, [lesson])

  const back = (
    <BackLink to="/grammar" className={styles.backSpacing}>
      {l.back}
    </BackLink>
  )

  if (!lesson) {
    return (
      <>
        {back}
        <NotFoundCard title={l.notFoundTitle} description={l.notFoundText} />
      </>
    )
  }

  const next = GRAMMAR_LESSONS[GRAMMAR_LESSONS.indexOf(lesson) + 1]
  const completed = progress?.status === 'completed'

  return (
    <article className={styles.lesson}>
      {back}
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <Badge tone="accent">{lesson.level}</Badge>
          <Badge>{g.categories[lesson.category]}</Badge>
          <LessonStatus progress={progress} />
        </div>
        <h1 className={styles.heroTitle} lang="en">
          {lesson.title}
        </h1>
        <p className={styles.heroSummary}>{lesson.summary}</p>
        <div className={styles.heroActions}>
          <Button
            size="sm"
            icon={completed ? <CircleCheck /> : undefined}
            onClick={() => void setCompleted(lesson.id, !completed)}
          >
            {completed ? l.markNotCompleted : l.markCompleted}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={progress?.bookmarked ? <BookmarkCheck /> : <Bookmark />}
            aria-pressed={progress?.bookmarked ?? false}
            onClick={() => void toggleBookmark(lesson.id)}
          >
            {progress?.bookmarked ? l.unbookmark : l.bookmark}
          </Button>
        </div>
      </header>

      <LessonSections lesson={lesson} />
      <PracticePanel lesson={lesson} progress={progress ?? null} />

      {next && (
        <ButtonLink to={`/grammar/${next.id}`} variant="ghost" className={styles.next}>
          {l.next}: <span lang="en">{next.title}</span>
        </ButtonLink>
      )}
    </article>
  )
}

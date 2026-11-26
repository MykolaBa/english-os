import type {
  InterviewAnswer,
  LessonProgress,
  ListeningProgress,
  ReadingProgress,
  Recording,
  Writing,
} from '@/lib/db/types'
import type { NextStep } from './agenda'

interface Item {
  id: string
  title: string
}

/** The first item not done yet (in course order), else the one with the lowest best score. */
export function firstOpenOrWeakest<T extends Item>(
  items: readonly T[],
  isDone: (item: T) => boolean,
  score: (item: T) => number,
): T | undefined {
  return items.find((i) => !isDone(i)) ?? items.toSorted((a, b) => score(a) - score(b))[0]
}

const step = (to: string, title: string | null): NextStep => ({ to, title })

export function nextLesson(lessons: readonly Item[], progress: Map<string, LessonProgress>) {
  const lesson = firstOpenOrWeakest(
    lessons,
    (l) => progress.get(l.id)?.status === 'completed',
    (l) => progress.get(l.id)?.bestScore ?? 0,
  )
  return lesson ? step(`/grammar/${lesson.id}`, lesson.title) : null
}

export function nextText(texts: readonly Item[], progress: Map<string, ReadingProgress>) {
  const text = firstOpenOrWeakest(
    texts,
    (t) => progress.get(t.id)?.readAt !== undefined,
    (t) => progress.get(t.id)?.bestScore ?? 0,
  )
  return text ? step(`/reading/${text.id}`, text.title) : null
}

export function nextEpisode(episodes: readonly Item[], progress: Map<string, ListeningProgress>) {
  const episode = firstOpenOrWeakest(
    episodes,
    (e) => progress.get(e.id)?.completedAt !== undefined,
    (e) => progress.get(e.id)?.bestScore ?? 0,
  )
  return episode ? step(`/listening/${episode.id}`, episode.title) : null
}

/**
 * Speaking: a shadowing set that still has sentences not sounding right (fewest "good"
 * first); once every set is mastered, the speaking task with the fewest takes.
 */
export function nextSpeaking(
  sets: readonly (Item & { sentences: readonly { id: string }[] })[],
  tasks: readonly Item[],
  takes: Map<string, Recording[]>,
) {
  const good = (set: (typeof sets)[number]) =>
    set.sentences.filter((s) => takes.get(s.id)?.[0]?.rating === 'good').length
  const set = sets
    .filter((s) => good(s) < s.sentences.length)
    .toSorted((a, b) => good(a) - good(b))[0]
  if (set) return step(`/speaking/shadow/${set.id}`, set.title)
  const task = tasks.toSorted(
    (a, b) => (takes.get(a.id)?.length ?? 0) - (takes.get(b.id)?.length ?? 0),
  )[0]
  return task ? step(`/speaking/task/${task.id}`, task.title) : null
}

/** Writing: finish the latest unfinished draft first; otherwise a task you haven't done. */
export function nextWriting(
  writings: readonly Writing[],
  prompts: readonly Item[],
  untitled: (w: Writing) => string,
) {
  const draft = writings
    .filter((w) => !w.completedAt && w.text.trim())
    .toSorted((a, b) => b.updatedAt - a.updatedAt)[0]
  if (draft) return step(`/writing/${draft.id}`, untitled(draft))
  const done = new Set(writings.filter((w) => w.completedAt).map((w) => w.promptId))
  const prompt = prompts.find((p) => !done.has(p.id))
  return step('/writing', prompt?.title ?? null)
}

/** IT English: the first interview question you can't answer confidently yet, else a phrase set. */
export function nextIt(
  questions: readonly (Item & { question?: string })[],
  answers: Map<string, InterviewAnswer>,
  phraseSets: readonly Item[],
  dayNumber: number,
) {
  const question = questions.find((q) => answers.get(q.id)?.status !== 'confident')
  if (question) return step(`/it-english/interview/${question.id}`, question.title)
  const set = phraseSets[dayNumber % Math.max(1, phraseSets.length)]
  return set ? step(`/it-english/phrases/${set.id}`, set.title) : null
}

import { GRAMMAR_LESSONS } from '@/content/grammar'
import { INTERVIEW_QUESTIONS, PHRASE_SETS } from '@/content/it'
import { LISTENING_EPISODES } from '@/content/listening'
import { READING_TEXTS } from '@/content/reading'
import { SHADOWING_SETS, SPEAKING_TASKS } from '@/content/speaking'
import { WRITING_PROMPTS } from '@/content/writing'
import { startOfDay, toDayKey } from '@/lib/date'
import { db } from '@/lib/db/db'
import type { PlanArea } from '@/lib/plan'
import { countDue } from '@/features/review/dueCount'
import { countIntroduced, getTodayLogs } from '@/features/review/reviewRepo'
import { recordingsByItem } from '@/features/speaking/speakingRepo'
import { activitySubject } from '@/features/writing/titles'
import { buildAgenda, type Agenda, type NextStep } from './agenda'
import { nextEpisode, nextIt, nextLesson, nextSpeaking, nextText, nextWriting } from './next'

export interface AgendaOptions {
  days: readonly number[]
  minutes: number
  focus: readonly PlanArea[]
  newWordsPerDay: number
  forceStudyDay: boolean
}

const byKey = <T, K extends keyof T>(rows: T[], key: K) => new Map(rows.map((r) => [r[key], r]))

const SPEAKING_IDS = [
  ...SHADOWING_SETS.flatMap((s) => s.sentences.map((x) => x.id)),
  ...SPEAKING_TASKS.map((t) => t.id),
]

/** Reads everything the agenda depends on (all reads in parallel) and builds it. */
export async function loadAgenda(now: number, options: AgendaOptions): Promise<Agenda> {
  const todayStart = startOfDay(new Date(now)).getTime()
  const [
    dueCount,
    todayLogs,
    lessons,
    reading,
    listening,
    takes,
    writings,
    answers,
    todayActivity,
  ] = await Promise.all([
    countDue(now),
    getTodayLogs(now),
    db.lessonProgress.toArray(),
    db.readingProgress.toArray(),
    db.listeningProgress.toArray(),
    recordingsByItem(SPEAKING_IDS),
    db.writings.toArray(),
    db.interviewAnswers.toArray(),
    db.activity.where('at').aboveOrEqual(todayStart).sortBy('at'),
  ])

  const next: Record<PlanArea, NextStep | null> = {
    grammar: nextLesson(GRAMMAR_LESSONS, byKey(lessons, 'lessonId')),
    reading: nextText(READING_TEXTS, byKey(reading, 'textId')),
    listening: nextEpisode(LISTENING_EPISODES, byKey(listening, 'episodeId')),
    speaking: nextSpeaking(SHADOWING_SETS, SPEAKING_TASKS, takes),
    writing: nextWriting(writings, WRITING_PROMPTS, activitySubject),
    it: nextIt(
      INTERVIEW_QUESTIONS.map((q) => ({ id: q.id, title: q.question })),
      byKey(answers, 'questionId'),
      PHRASE_SETS,
      Math.floor(todayStart / 86_400_000),
    ),
  }

  return buildAgenda({
    today: toDayKey(now),
    days: options.days,
    minutes: options.minutes,
    focus: options.focus,
    dueCount,
    newLeft: Math.max(0, options.newWordsPerDay - countIntroduced(todayLogs)),
    next,
    todayActivity,
    forceStudyDay: options.forceStudyDay,
  })
}

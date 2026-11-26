import { useLiveQuery } from 'dexie-react-hooks'
import { useShallow } from 'zustand/react/shallow'
import { db } from '@/lib/db/db'
import { useNow } from '@/lib/useNow'
import { useSettings } from '@/stores/settingsStore'
import type { Agenda } from './agenda'
import { loadAgenda } from './loadAgenda'
import { weekStart } from './week'

/** Today's agenda, live: it updates as you study (done ticks) and as time passes. */
export function useAgenda(forceStudyDay = false): Agenda | undefined {
  const now = useNow()
  const plan = useSettings(
    useShallow((s) => ({
      days: s.studyDays,
      minutes: s.studyMinutes,
      focus: s.studyFocus,
      newWordsPerDay: s.newWordsPerDay,
    })),
  )
  return useLiveQuery(
    () => loadAgenda(now, { ...plan, forceStudyDay }),
    [now, plan.days, plan.minutes, plan.focus, plan.newWordsPerDay, forceStudyDay],
  )
}

/** This week's activity (Monday on), for the week strip. */
export function useWeekActivity() {
  const now = useNow()
  const since = weekStart(now).getTime()
  return useLiveQuery(() => db.activity.where('at').aboveOrEqual(since).toArray(), [since])
}

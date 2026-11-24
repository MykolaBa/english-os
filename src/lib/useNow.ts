import { useEffect, useState } from 'react'

/**
 * The current time, refreshed every `intervalMs` and whenever the tab becomes visible again.
 * Pass it to `useLiveQuery` deps so time-based queries ("due now") don't go stale —
 * live queries otherwise re-run only when the database changes, not when time passes.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const tick = () => setNow(Date.now())
    const id = window.setInterval(tick, intervalMs)
    const onVisible = () => document.visibilityState === 'visible' && tick()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])
  return now
}

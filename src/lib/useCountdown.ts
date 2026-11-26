import { useEffect, useState } from 'react'

/** Seconds left of `total` and seconds passed (keeps counting past zero), from mount. */
export function useCountdown(total: number): { left: number; elapsed: () => number } {
  const [startedAt] = useState(() => Date.now())
  const [now, setNow] = useState(startedAt)
  const left = Math.max(0, total - (now - startedAt) / 1000)
  const finished = left === 0

  // Tick only while time remains; at zero the display stops changing.
  useEffect(() => {
    if (finished) return
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [finished])

  return { left, elapsed: () => Math.round((Date.now() - startedAt) / 1000) }
}

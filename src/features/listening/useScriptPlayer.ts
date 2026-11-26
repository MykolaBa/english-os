import { useCallback, useEffect, useRef, useState } from 'react'
import type { ScriptLine } from '@/content/listening'

/** Speaks one line; resolves true when it played to the end. */
export type SayLine = (line: ScriptLine, rate: number) => Promise<boolean>

export const RATES = [0.75, 0.9, 1] as const
export type Rate = (typeof RATES)[number]

/**
 * Plays a script line by line, so the current line can be highlighted, any line can be
 * played from, and pausing works the same in every browser (speechSynthesis.pause()
 * doesn't on Android: pausing cancels the line, resuming replays it from its start).
 * Each run has a token; starting another run or pausing makes the old one stop quietly.
 */
export function useScriptPlayer(lines: readonly ScriptLine[], say: SayLine, stopAll: () => void) {
  const [current, setCurrent] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [rate, setRateState] = useState<Rate>(0.9)
  const run = useRef(0)
  const rateRef = useRef<Rate>(rate)

  const playFrom = useCallback(
    async (from: number) => {
      const token = ++run.current
      stopAll()
      setPlaying(true)
      // Chrome can drop an utterance queued in the same task as cancel(): let one pass.
      await new Promise((resolve) => window.setTimeout(resolve, 0))
      if (run.current !== token) return
      for (let i = Math.max(0, from); i < lines.length; i++) {
        const line = lines[i]
        if (!line || run.current !== token) return
        setCurrent(i)
        const finished = await say(line, rateRef.current)
        if (run.current !== token) return
        if (!finished) {
          setPlaying(false)
          return
        }
      }
      setPlaying(false)
      setCurrent(null)
    },
    [lines, say, stopAll],
  )

  const pause = useCallback(() => {
    run.current++
    stopAll()
    setPlaying(false)
  }, [stopAll])

  const toggle = useCallback(
    () => (playing ? pause() : void playFrom(current ?? 0)),
    [playing, pause, playFrom, current],
  )

  /** A new speed applies from the next line. */
  const setRate = useCallback((next: Rate) => {
    rateRef.current = next
    setRateState(next)
  }, [])

  // Leaving the page stops the voice.
  useEffect(
    () => () => {
      run.current++
      stopAll()
    },
    [stopAll],
  )

  return { current, playing, rate, setRate, playFrom, pause, toggle }
}

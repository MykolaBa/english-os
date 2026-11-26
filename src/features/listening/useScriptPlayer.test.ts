import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

/** Playback waits one task after cancelling (a Chrome quirk); wait for it to start. */
const started = (expectation: () => void) => vi.waitFor(expectation)
import type { ScriptLine } from '@/content/listening'
import { useScriptPlayer } from './useScriptPlayer'

const lines: ScriptLine[] = ['one', 'two', 'three'].map((en) => ({ speaker: 'N', en, uk: en }))

/** A fake voice: each line waits until the test lets it finish (or it's stopped). */
function fakeVoice() {
  let finish: ((ok: boolean) => void) | null = null
  const said: string[] = []
  const say = vi.fn((line: ScriptLine) => {
    said.push(line.en)
    return new Promise<boolean>((resolve) => (finish = resolve))
  })
  const stopAll = vi.fn(() => finish?.(false))
  const end = async () => {
    await act(async () => {
      finish?.(true)
      await Promise.resolve()
    })
  }
  return { say, stopAll, said, end }
}

describe('useScriptPlayer', () => {
  it('plays lines in order and highlights the current one', async () => {
    const v = fakeVoice()
    const { result } = renderHook(() => useScriptPlayer(lines, v.say, v.stopAll))
    await act(async () => void result.current.playFrom(0))
    await started(() => expect(result.current).toMatchObject({ current: 0, playing: true }))
    await v.end()
    expect(result.current.current).toBe(1)
    await v.end()
    await v.end()
    expect(v.said).toEqual(['one', 'two', 'three'])
    expect(result.current).toMatchObject({ current: null, playing: false })
  })

  it('pauses on the current line and resumes from it', async () => {
    const v = fakeVoice()
    const { result } = renderHook(() => useScriptPlayer(lines, v.say, v.stopAll))
    await act(async () => void result.current.playFrom(1))
    await started(() => expect(v.said).toEqual(['two']))
    await act(async () => result.current.pause())
    expect(result.current).toMatchObject({ current: 1, playing: false })
    await act(async () => result.current.toggle())
    await started(() => expect(v.said).toEqual(['two', 'two']))
    expect(result.current.playing).toBe(true)
  })

  it('jumping to another line stops the old run', async () => {
    const v = fakeVoice()
    const { result } = renderHook(() => useScriptPlayer(lines, v.say, v.stopAll))
    await act(async () => void result.current.playFrom(0))
    await started(() => expect(v.said).toEqual(['one']))
    await act(async () => void result.current.playFrom(2))
    await started(() => expect(v.said).toEqual(['one', 'three']))
    await v.end()
    expect(v.said).toEqual(['one', 'three'])
    expect(result.current.playing).toBe(false)
  })

  it('stops the voice when unmounted', async () => {
    const v = fakeVoice()
    const { result, unmount } = renderHook(() => useScriptPlayer(lines, v.say, v.stopAll))
    await act(async () => void result.current.playFrom(0))
    await started(() => expect(v.said).toEqual(['one']))
    v.stopAll.mockClear()
    unmount()
    expect(v.stopAll).toHaveBeenCalled()
  })
})

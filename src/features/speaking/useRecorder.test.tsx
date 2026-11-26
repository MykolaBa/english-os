import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useRecorder } from './useRecorder'

/** A fake microphone stream whose track we can watch. */
function fakeStream() {
  const track = { stop: vi.fn() }
  return { track, stream: { getTracks: () => [track] } as unknown as MediaStream }
}

function stubMedia(getUserMedia: () => Promise<MediaStream>) {
  const created = vi.fn()
  class FakeRecorder {
    static isTypeSupported = () => true
    state = 'inactive'
    mimeType = 'audio/webm'
    constructor() {
      created()
    }
    start() {
      this.state = 'recording'
    }
    stop() {
      this.state = 'inactive'
    }
  }
  vi.stubGlobal('MediaRecorder', FakeRecorder)
  Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia }, configurable: true })
  return { created }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useRecorder', () => {
  it('releases the microphone if the page closed while permission was being asked', async () => {
    const { track, stream } = fakeStream()
    let grant: (s: MediaStream) => void = () => {}
    const { created } = stubMedia(() => new Promise((resolve) => (grant = resolve)))
    const { result, unmount } = renderHook(() => useRecorder(60_000, vi.fn()))

    let started: Promise<void> | undefined
    act(() => {
      started = result.current.start()
    })
    expect(result.current.status).toBe('starting')
    unmount()
    grant(stream)
    await started

    expect(track.stop).toHaveBeenCalled()
    expect(created).not.toHaveBeenCalled()
  })

  it('reports a blocked microphone', async () => {
    stubMedia(() => Promise.reject(new DOMException('no', 'NotAllowedError')))
    const { result } = renderHook(() => useRecorder(60_000, vi.fn()))
    await act(() => result.current.start())
    expect(result.current.status).toBe('denied')
  })
})

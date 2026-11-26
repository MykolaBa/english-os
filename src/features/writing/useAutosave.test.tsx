import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/lib/db/db'
import { useAutosave } from './useAutosave'
import { createWriting } from './writingRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('useAutosave', () => {
  it('saves after typing stops, and flush saves at once', async () => {
    const id = await createWriting(null)
    const { result } = renderHook(() => useAutosave(id, { text: '', title: '' }))
    vi.useFakeTimers()
    act(() => result.current.change({ text: 'Hello', title: '' }))
    expect(result.current.state).toBe('pending')
    await act(async () => {
      vi.advanceTimersByTime(800)
    })
    vi.useRealTimers()
    await vi.waitFor(async () => expect((await db.writings.get(id))?.text).toBe('Hello'))

    act(() => result.current.change({ text: 'Hello world', title: 'T' }))
    await act(() => result.current.flush())
    expect(await db.writings.get(id)).toMatchObject({ text: 'Hello world', title: 'T' })
    expect(result.current.state).toBe('saved')
  })

  it('saves unsaved text when the editor closes', async () => {
    const id = await createWriting(null)
    const { result, unmount } = renderHook(() => useAutosave(id, { text: '', title: '' }))
    act(() => result.current.change({ text: 'Last words', title: '' }))
    unmount()
    await vi.waitFor(async () => expect((await db.writings.get(id))?.text).toBe('Last words'))
  })
})

describe('useAutosave discarding', () => {
  it('removes an untouched piece after the editor closes, unless it reopens', async () => {
    const kept = await createWriting(null)
    const gone = await createWriting(null)
    vi.useFakeTimers()
    const first = renderHook(() => useAutosave(gone, { text: '', title: '' }))
    first.unmount()
    // StrictMode-like remount of another piece right away keeps that one.
    const a = renderHook(() => useAutosave(kept, { text: '', title: '' }))
    a.unmount()
    renderHook(() => useAutosave(kept, { text: '', title: '' }))
    await act(() => vi.advanceTimersByTimeAsync(2000))
    vi.useRealTimers()
    await vi.waitFor(async () => expect(await db.writings.get(gone)).toBeUndefined())
    expect(await db.writings.get(kept)).toBeDefined()
  })
})

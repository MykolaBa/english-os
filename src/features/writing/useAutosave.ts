import { useCallback, useEffect, useRef, useState } from 'react'
import { discardIfEmpty, saveDraft } from './writingRepo'

const DELAY_MS = 700
/** An untouched piece is removed this long after its editor closes… */
const DISCARD_AFTER_MS = 1500
/**
 * …unless an editor for it mounts again first (React StrictMode mounts effects twice in
 * development, and going back and forth quickly reopens the same piece).
 */
const pendingDiscards = new Map<string, symbol>()

export type SaveState = 'saved' | 'pending' | 'saving'

/**
 * Saves the draft a moment after typing stops. `flush()` saves right away — call it
 * before anything that reads the stored text (save version, mark done). Unsaved text
 * is also written when the editor closes, and an untouched piece is discarded then.
 */
export function useAutosave(id: string, draft: { text: string; title: string }) {
  const [state, setState] = useState<SaveState>('saved')
  const latest = useRef(draft)
  const dirty = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  const flush = useCallback(async () => {
    window.clearTimeout(timer.current)
    if (!dirty.current) return
    dirty.current = false
    setState('saving')
    await saveDraft(id, latest.current)
    // Typing during the save marks it dirty again; the next timer saves that.
    setState(dirty.current ? 'pending' : 'saved')
  }, [id])

  const change = useCallback(
    (next: { text: string; title: string }) => {
      latest.current = next
      dirty.current = true
      setState('pending')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => void flush(), DELAY_MS)
    },
    [flush],
  )

  // Leaving the page (or the tab going to the background on a phone) saves immediately.
  useEffect(() => {
    // Reopened: cancel a discard scheduled by the editor that just closed.
    pendingDiscards.delete(id)
    const onHide = () => document.visibilityState === 'hidden' && void flush()
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      // Save what's left; a piece never written in is removed instead of kept empty.
      // The mark is set synchronously, so a remount right after can still cancel it.
      const mark = Symbol(id)
      pendingDiscards.set(id, mark)
      void flush().then(() =>
        window.setTimeout(() => {
          if (pendingDiscards.get(id) !== mark) return
          pendingDiscards.delete(id)
          void discardIfEmpty(id)
        }, DISCARD_AFTER_MS),
      )
    }
  }, [flush, id])

  // Keep `latest` in step with the first render (and outside edits like "restore").
  useEffect(() => {
    if (!dirty.current) latest.current = draft
  }, [draft])

  return { state, change, flush }
}

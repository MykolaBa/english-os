import { useCallback, useEffect, useRef, useState } from 'react'
import { isRecordingSupported, pickMimeType, recorderProblem, rmsLevel } from './recorder'

export type RecorderStatus =
  'idle' | 'starting' | 'recording' | 'unsupported' | 'denied' | 'noMicrophone' | 'error'

export interface RecordingResult {
  audio: Blob
  mimeType: string
  durationMs: number
}

/** Shorter than this is a mis-tap, not an attempt. */
const MIN_MS = 400

interface Session {
  recorder: MediaRecorder
  stream: MediaStream
  audioContext?: AudioContext
  startedAt: number
  /** Unmounting mid-recording stops it without saving. */
  discard: boolean
}

/**
 * Records from the microphone with MediaRecorder. One recording at a time; stops by
 * itself at `maxMs`. `level` (0..1) drives a loudness meter while recording.
 * The microphone is released (the browser's red dot goes away) as soon as it stops.
 */
export function useRecorder(maxMs: number, onDone: (result: RecordingResult) => void) {
  const [status, setStatus] = useState<RecorderStatus>(() =>
    isRecordingSupported() ? 'idle' : 'unsupported',
  )
  const [level, setLevel] = useState(0)
  const session = useRef<Session | null>(null)
  // Guards the gap while the browser asks for permission: a second start, or unmounting.
  const starting = useRef(false)
  const unmounted = useRef(false)
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])

  const stop = useCallback(() => {
    const s = session.current
    if (s && s.recorder.state !== 'inactive') s.recorder.stop()
  }, [])

  const start = useCallback(async () => {
    if (!isRecordingSupported() || session.current || starting.current) return
    starting.current = true
    setStatus('starting')
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
    } catch (err) {
      starting.current = false
      if (!unmounted.current) setStatus(recorderProblem(err))
      return
    }
    starting.current = false
    // The page closed while permission was being asked: release the mic, record nothing.
    if (unmounted.current) {
      stream.getTracks().forEach((track) => track.stop())
      return
    }
    const mimeType = pickMimeType((t) => MediaRecorder.isTypeSupported(t))
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    const chunks: Blob[] = []
    const s: Session = { recorder, stream, startedAt: Date.now(), discard: false }
    session.current = s

    recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data)
    recorder.onstop = () => {
      window.clearTimeout(limit)
      stream.getTracks().forEach((track) => track.stop())
      void s.audioContext?.close()
      session.current = null
      setLevel(0)
      setStatus('idle')
      const durationMs = Date.now() - s.startedAt
      if (s.discard || durationMs < MIN_MS) return
      const type = recorder.mimeType || mimeType || 'audio/webm'
      done.current({ audio: new Blob(chunks, { type }), mimeType: type, durationMs })
    }
    const limit = window.setTimeout(() => recorder.stop(), maxMs)
    recorder.start(250)
    setStatus('recording')

    // Loudness meter: optional, so a failure here never stops the recording.
    try {
      const context = new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 512
      context.createMediaStreamSource(stream).connect(analyser)
      s.audioContext = context
      const samples = new Uint8Array(analyser.fftSize)
      const tick = () => {
        if (session.current !== s) return
        analyser.getByteTimeDomainData(samples)
        setLevel(rmsLevel(samples))
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    } catch {
      // No Web Audio: recording works without the meter.
    }
  }, [maxMs])

  // Leaving the page mid-recording releases the microphone and throws the take away.
  useEffect(() => {
    unmounted.current = false
    return () => {
      unmounted.current = true
      const s = session.current
      if (!s) return
      s.discard = true
      if (s.recorder.state !== 'inactive') s.recorder.stop()
    }
  }, [])

  return { status, level, start, stop }
}

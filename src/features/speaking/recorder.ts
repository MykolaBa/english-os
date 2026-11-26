/**
 * Pure helpers for recording audio in the browser. MediaRecorder formats differ:
 * Chrome/Firefox record WebM/Opus, Safari (iOS too) records MP4/AAC.
 */

/** Preferred first: small and widely playable. */
export const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
] as const

/** The first format this browser can record, or '' to let it choose its default. */
export function pickMimeType(isSupported: (type: string) => boolean): string {
  return MIME_CANDIDATES.find((type) => isSupported(type)) ?? ''
}

export function isRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'MediaRecorder' in window &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  )
}

/** Why recording couldn't start, from the getUserMedia error. */
export function recorderProblem(err: unknown): 'denied' | 'noMicrophone' | 'error' {
  const name = err instanceof DOMException || err instanceof Error ? err.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied'
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'noMicrophone'
  return 'error'
}

/** Loudness of a block of samples (0..1), from the analyser's time-domain bytes. */
export function rmsLevel(samples: Uint8Array): number {
  if (samples.length === 0) return 0
  let sum = 0
  for (const s of samples) {
    const v = (s - 128) / 128
    sum += v * v
  }
  // Speech rarely goes past ~0.3 RMS; scale so normal speaking fills most of the meter.
  return Math.min(1, Math.sqrt(sum / samples.length) * 3)
}

/** 83_400 → "1:23" */
export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

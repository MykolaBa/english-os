import { describe, expect, it } from 'vitest'
import { formatDuration, pickMimeType, recorderProblem, rmsLevel } from './recorder'

describe('recorder helpers', () => {
  it('picks the first supported format', () => {
    expect(pickMimeType((t) => t === 'audio/mp4')).toBe('audio/mp4')
    expect(pickMimeType(() => true)).toBe('audio/webm;codecs=opus')
    expect(pickMimeType(() => false)).toBe('')
  })

  it('explains why the microphone failed', () => {
    expect(recorderProblem(new DOMException('no', 'NotAllowedError'))).toBe('denied')
    expect(recorderProblem(new DOMException('no', 'NotFoundError'))).toBe('noMicrophone')
    expect(recorderProblem(new Error('boom'))).toBe('error')
    expect(recorderProblem('weird')).toBe('error')
  })

  it('measures loudness from 0 (silence) up to 1', () => {
    expect(rmsLevel(new Uint8Array([128, 128, 128]))).toBe(0)
    expect(rmsLevel(new Uint8Array([255, 0, 255, 0]))).toBe(1)
    expect(rmsLevel(new Uint8Array([]))).toBe(0)
  })

  it('formats durations', () => {
    expect(formatDuration(83_400)).toBe('1:23')
    expect(formatDuration(0)).toBe('0:00')
  })
})

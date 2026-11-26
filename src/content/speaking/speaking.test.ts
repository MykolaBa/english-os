import { describe, expect, it } from 'vitest'
import { RECORDING_MAX_MS } from '@/lib/db/limits'
import { SHADOWING_SETS, SPEAKING_TASKS } from './index'

const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('speaking content', () => {
  it('has unique set, sentence and task ids', () => {
    expect(unique(SHADOWING_SETS.map((s) => s.id))).toBe(true)
    expect(unique(SPEAKING_TASKS.map((t) => t.id))).toBe(true)
    const sentenceIds = SHADOWING_SETS.flatMap((s) => s.sentences.map((x) => x.id))
    expect(unique(sentenceIds)).toBe(true)
  })

  it('prefixes sentence ids with their set (recordings are found by them)', () => {
    for (const set of SHADOWING_SETS) {
      for (const s of set.sentences) expect(s.id.startsWith(`${set.id}:`)).toBe(true)
    }
  })

  it('keeps every task within the recording limit', () => {
    for (const task of SPEAKING_TASKS) {
      expect(task.seconds * 1000).toBeLessThan(RECORDING_MAX_MS)
      expect(task.points.length).toBeGreaterThan(0)
    }
  })
})

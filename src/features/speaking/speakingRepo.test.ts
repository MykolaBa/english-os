import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { RECORDINGS_PER_ITEM } from '@/lib/db/limits'
import {
  rateRecording,
  recordingsByItem,
  saveRecording,
  speakingXp,
  XP_SHADOWING,
  XP_TASK,
} from './speakingRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

const take = (itemId: string, durationMs = 3000) => ({
  kind: 'shadowing' as const,
  itemId,
  audio: new Blob(['abc'], { type: 'audio/webm' }),
  mimeType: 'audio/webm',
  durationMs,
})

describe('speaking repo', () => {
  it('keeps only the newest takes of an item and logs XP for each', async () => {
    for (let i = 0; i < RECORDINGS_PER_ITEM + 2; i++)
      await saveRecording(take('s:1'), 'Set', 10 + i)
    await saveRecording(take('s:2'), 'Set', 100)
    const byItem = await recordingsByItem(['s:1', 's:2'])
    expect(byItem.get('s:1')?.map((r) => r.createdAt)).toEqual([14, 13, 12])
    expect(byItem.get('s:2')).toHaveLength(1)
    expect(await db.activity.count()).toBe(RECORDINGS_PER_ITEM + 3)
    expect((await db.activity.toArray())[0]).toMatchObject({
      type: 'speaking',
      xp: XP_SHADOWING,
      subject: 'Set',
      refId: 's:1',
    })
  })

  it('stores the audio and the self-rating', async () => {
    const r = await saveRecording(take('s:1'), 'Set', 1)
    await rateRecording(r.id, 'almost')
    const saved = await db.recordings.get(r.id)
    // fake-indexeddb can't store Blobs; real IndexedDB does (checked in the browser).
    expect(saved).toMatchObject({ rating: 'almost', mimeType: 'audio/webm', durationMs: 3000 })
  })

  it('gives more XP for a full monologue', () => {
    expect(speakingXp('task', 45_000)).toBe(XP_TASK)
    expect(speakingXp('task', 5_000)).toBeLessThan(XP_TASK)
    expect(speakingXp('shadowing', 45_000)).toBe(XP_SHADOWING)
  })
})

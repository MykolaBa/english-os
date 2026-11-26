import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { WRITING_VERSIONS_MAX } from '@/lib/db/limits'
import {
  completeWriting,
  discardIfEmpty,
  createWriting,
  restoreVersion,
  saveDraft,
  saveVersion,
  writingXp,
} from './writingRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('writing repo', () => {
  it('autosaves the draft without creating versions', async () => {
    const id = await createWriting('bug-report', 1)
    await saveDraft(id, { text: 'Steps to reproduce', title: 'Cart bug' }, 2)
    expect(await db.writings.get(id)).toMatchObject({
      promptId: 'bug-report',
      text: 'Steps to reproduce',
      title: 'Cart bug',
      versions: [],
      updatedAt: 2,
    })
  })

  it('saves a version only when the text changed, and keeps the newest ones', async () => {
    const id = await createWriting(null, 1)
    expect(await saveVersion(id, 2)).toBe(false) // empty text
    await saveDraft(id, { text: 'one' }, 3)
    expect(await saveVersion(id, 4)).toBe(true)
    expect(await saveVersion(id, 5)).toBe(false) // unchanged
    for (let i = 0; i < WRITING_VERSIONS_MAX + 2; i++) {
      await saveDraft(id, { text: `v${i}` }, 10 + i)
      await saveVersion(id, 10 + i)
    }
    const versions = (await db.writings.get(id))?.versions ?? []
    expect(versions).toHaveLength(WRITING_VERSIONS_MAX)
    expect(versions.at(-1)?.text).toBe(`v${WRITING_VERSIONS_MAX + 1}`)
  })

  it('restores a version and keeps the current text as a version', async () => {
    const id = await createWriting(null, 1)
    await saveDraft(id, { text: 'first draft' }, 2)
    await saveVersion(id, 3)
    await saveDraft(id, { text: 'second draft' }, 4)
    await restoreVersion(id, 3, 5)
    const w = await db.writings.get(id)
    expect(w?.text).toBe('first draft')
    expect(w?.versions.map((v) => v.text)).toEqual(['first draft', 'second draft'])
  })

  it('gives XP once, with the final version saved', async () => {
    const id = await createWriting(null, 1)
    expect(await completeWriting(id, 'Empty', 2)).toBe(0) // nothing written yet
    await saveDraft(id, { text: 'word '.repeat(45) }, 3)
    expect(await completeWriting(id, 'Notes', 4)).toBe(writingXp(45))
    expect(await completeWriting(id, 'Notes', 5)).toBe(0)
    const w = await db.writings.get(id)
    expect(w?.completedAt).toBe(4)
    expect(w?.versions).toHaveLength(1)
    expect(await db.activity.toArray()).toMatchObject([
      { type: 'writing', xp: 14, subject: 'Notes', refId: id },
    ])
  })

  it('caps length XP', () => {
    expect(writingXp(0)).toBe(10)
    expect(writingXp(1000)).toBe(30)
  })

  it('discards a piece that was never written in, and only that', async () => {
    const empty = await createWriting('bug-report', 1)
    const titled = await createWriting(null, 1)
    await saveDraft(titled, { title: 'Ideas' }, 2)
    expect(await discardIfEmpty(empty)).toBe(true)
    expect(await discardIfEmpty(titled)).toBe(false)
    expect(await db.writings.count()).toBe(1)
  })
})

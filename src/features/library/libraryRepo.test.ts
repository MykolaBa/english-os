import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import {
  addLibraryItem,
  EMPTY_LIBRARY_DRAFT,
  libraryXp,
  setLibraryStatus,
  titleFor,
  updateLibraryItem,
  validateLibraryDraft,
} from './libraryRepo'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

const draft = (patch: Partial<typeof EMPTY_LIBRARY_DRAFT>) => ({ ...EMPTY_LIBRARY_DRAFT, ...patch })

describe('library drafts', () => {
  it('needs text or a link, and only a web link', () => {
    expect(validateLibraryDraft(draft({}))).toBe('needContent')
    expect(validateLibraryDraft(draft({ url: 'javascript:alert(1)', text: 'x' }))).toBe('badUrl')
    expect(validateLibraryDraft(draft({ url: 'react.dev' }))).toBeNull()
  })

  it('finds a title when none is typed', () => {
    expect(titleFor(draft({ text: 'one two three four five six seven eight nine' }))).toBe(
      'one two three four five six seven eight…',
    )
    expect(titleFor(draft({ url: 'https://react.dev/learn' }))).toBe('react.dev')
  })
})

describe('library repo', () => {
  it('stores normalised fields and clears a removed link', async () => {
    const id = await addLibraryItem(
      draft({ text: ' Text. ', url: 'react.dev', tags: 'React, docs' }),
      1,
    )
    expect(await db.library.get(id)).toMatchObject({
      text: 'Text.',
      url: 'https://react.dev/',
      tags: ['react', 'docs'],
      status: 'toRead',
    })
    await updateLibraryItem(id, draft({ text: 'Text.' }), 2)
    expect((await db.library.get(id))?.url).toBeUndefined()
  })

  it('gives XP the first time an item is done', async () => {
    const id = await addLibraryItem(draft({ title: 'Doc', text: 'word '.repeat(250) }), 1)
    expect(await setLibraryStatus(id, 'reading', 2)).toBe(0)
    expect(await setLibraryStatus(id, 'done', 3)).toBe(libraryXp(250))
    expect(await setLibraryStatus(id, 'toRead', 4)).toBe(0)
    expect(await setLibraryStatus(id, 'done', 5)).toBe(0)
    expect(await db.activity.toArray()).toMatchObject([
      { type: 'reading', xp: 7, subject: 'Doc', refId: id },
    ])
    expect((await db.library.get(id))?.readAt).toBe(3)
  })
})

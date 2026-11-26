import { describe, expect, it } from 'vitest'
import type { Recording, Writing } from '@/lib/db/types'
import { firstOpenOrWeakest, nextIt, nextSpeaking, nextWriting } from './next'

const items = [
  { id: 'a', title: 'A' },
  { id: 'b', title: 'B' },
  { id: 'c', title: 'C' },
]

describe('firstOpenOrWeakest', () => {
  it('takes the first open item, else the weakest', () => {
    expect(
      firstOpenOrWeakest(
        items,
        (i) => i.id === 'a',
        () => 0,
      )?.id,
    ).toBe('b')
    const scores: Record<string, number> = { a: 90, b: 40, c: 70 }
    expect(
      firstOpenOrWeakest(
        items,
        () => true,
        (i) => scores[i.id] ?? 0,
      )?.id,
    ).toBe('b')
  })
})

describe('nextSpeaking', () => {
  const sets = [
    { id: 's1', title: 'S1', sentences: [{ id: 's1:1' }, { id: 's1:2' }] },
    { id: 's2', title: 'S2', sentences: [{ id: 's2:1' }] },
  ]
  const take = (rating: Recording['rating']) => [{ rating } as Recording]
  it('suggests the shadowing set with the fewest good takes', () => {
    const takes = new Map([['s1:1', take('good')]])
    expect(nextSpeaking(sets, items, takes)?.to).toBe('/speaking/shadow/s2')
  })
  it('moves on to the least practised task once all sets sound good', () => {
    const takes = new Map<string, Recording[]>([
      ['s1:1', take('good')],
      ['s1:2', take('good')],
      ['s2:1', take('good')],
      ['a', take(undefined)],
    ])
    expect(nextSpeaking(sets, items, takes)?.to).toBe('/speaking/task/b')
  })
})

describe('nextWriting', () => {
  const w = (patch: Partial<Writing>): Writing => ({
    id: 'w',
    promptId: null,
    title: '',
    text: '',
    versions: [],
    checked: [],
    createdAt: 0,
    updatedAt: 0,
    ...patch,
  })
  it('continues the latest unfinished draft', () => {
    const writings = [
      w({ id: 'old', text: 'x', updatedAt: 1 }),
      w({ id: 'new', text: 'y', updatedAt: 2 }),
    ]
    expect(nextWriting(writings, items, () => 'Draft')).toEqual({
      to: '/writing/new',
      title: 'Draft',
    })
  })
  it('otherwise suggests a task not done yet', () => {
    const writings = [w({ promptId: 'a', text: 'x', completedAt: 1 })]
    expect(nextWriting(writings, items, () => '')).toEqual({ to: '/writing', title: 'B' })
  })
})

describe('nextIt', () => {
  it('prefers an interview question that isn’t confident yet', () => {
    const answers = new Map([['a', { status: 'confident' }]]) as Map<string, never>
    expect(nextIt(items, answers, items, 0)?.to).toBe('/it-english/interview/b')
  })
})

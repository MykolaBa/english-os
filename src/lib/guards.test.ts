import { describe, expect, expectTypeOf, it } from 'vitest'
import { isOneOf, isStringArray, parseOneOf } from './guards'

const LEVELS = ['A1', 'A2', 'B1'] as const

describe('guards', () => {
  it('narrows to allowed literals', () => {
    const raw: unknown = 'A2'
    if (isOneOf(LEVELS, raw)) expectTypeOf(raw).toEqualTypeOf<'A1' | 'A2' | 'B1'>()
    expect(isOneOf(LEVELS, 'A2')).toBe(true)
    expect(isOneOf(LEVELS, 'C2')).toBe(false)
    expect(isOneOf(LEVELS, null)).toBe(false)
  })

  it('parses with a fallback', () => {
    expect(parseOneOf(LEVELS, 'B1')).toBe('B1')
    expect(parseOneOf(LEVELS, 'bogus') ?? 'A1').toBe('A1')
  })

  it('checks string arrays', () => {
    expect(isStringArray(['a', 'b'])).toBe(true)
    expect(isStringArray(['a', 1])).toBe(false)
    expect(isStringArray('a')).toBe(false)
  })
})

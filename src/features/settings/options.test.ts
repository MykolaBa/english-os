import { describe, expect, it } from 'vitest'
import { withCurrent } from './options'

describe('withCurrent', () => {
  it('adds a value that is not a preset, keeping the list sorted', () => {
    expect(withCurrent([5, 10, 20], 12)).toEqual([5, 10, 12, 20])
  })
  it('does not duplicate a preset', () => {
    expect(withCurrent([5, 10], 10)).toEqual([5, 10])
  })
})

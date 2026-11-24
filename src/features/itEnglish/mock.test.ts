import { describe, expect, it } from 'vitest'
import { INTERVIEW_QUESTIONS } from '@/content/it'
import { formatClock, pickMockQuestions } from './mock'

describe('pickMockQuestions', () => {
  it('opens with "tell me about yourself" and has no repeats', () => {
    const picked = pickMockQuestions(INTERVIEW_QUESTIONS, 'all', 5, 'x')
    expect(picked).toHaveLength(5)
    expect(picked[0]?.id).toBe('tell-me-about-yourself')
    expect(new Set(picked.map((q) => q.id)).size).toBe(5)
  })

  it('filters by kind', () => {
    const picked = pickMockQuestions(INTERVIEW_QUESTIONS, 'technical', 5, 'x')
    expect(picked.length).toBeGreaterThan(0)
    expect(picked.every((q) => q.kind === 'technical')).toBe(true)
  })

  it('is repeatable with the same seed', () => {
    const ids = (seed: string) =>
      pickMockQuestions(INTERVIEW_QUESTIONS, 'all', 5, seed).map((q) => q.id)
    expect(ids('a')).toEqual(ids('a'))
  })
})

describe('formatClock', () => {
  it('formats minutes and seconds', () => {
    expect(formatClock(120)).toBe('2:00')
    expect(formatClock(65.2)).toBe('1:06')
    expect(formatClock(-3)).toBe('0:00')
  })
})

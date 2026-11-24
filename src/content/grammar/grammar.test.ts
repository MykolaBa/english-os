import { describe, expect, it } from 'vitest'
import { checkExercise } from '@/lib/exercises/check'
import { GRAMMAR_LESSONS } from './index'

/** Content tests: catch broken lessons before they reach the app. */
describe('grammar content', () => {
  it('has unique lesson ids and unique exercise ids', () => {
    const lessonIds = GRAMMAR_LESSONS.map((l) => l.id)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    const exerciseIds = GRAMMAR_LESSONS.flatMap((l) => l.exercises.map((e) => e.id))
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length)
  })

  it.each(GRAMMAR_LESSONS.map((l) => [l.id, l] as const))('%s is complete and its answers check as correct', (_, lesson) => {
    expect(lesson.explanation.length).toBeGreaterThan(0)
    expect(lesson.forms.length).toBeGreaterThan(0)
    expect(lesson.mistakes.length).toBeGreaterThan(0)
    expect(lesson.exercises.length).toBeGreaterThanOrEqual(6)
    for (const ex of lesson.exercises) {
      if (ex.type === 'choice') {
        expect(ex.options[ex.answer], ex.id).toBeDefined()
        expect(checkExercise(ex, ex.answer).correct, ex.id).toBe(true)
      } else {
        for (const answer of ex.answers) expect(checkExercise(ex, answer).correct, `${ex.id}: ${answer}`).toBe(true)
      }
      if (ex.type === 'gap') expect(ex.prompt, ex.id).toContain('___')
      if (ex.type === 'order') {
        // Every word of the first answer must be among the tiles, and vice versa.
        const words = ex.answers[0]!.split(' ').map((w) => w.toLowerCase()).toSorted()
        expect(ex.tokens.map((w) => w.toLowerCase()).toSorted(), ex.id).toEqual(words)
      }
    }
  })
})

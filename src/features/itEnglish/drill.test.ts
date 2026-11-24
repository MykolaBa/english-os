import { describe, expect, it } from 'vitest'
import { PHRASE_SETS } from '@/content/it'
import { checkExercise } from '@/lib/exercises/check'
import { buildPhraseDrill, gap, keyWordOf } from './drill'

describe('keyWordOf', () => {
  it('picks the longest word of four letters or more', () => {
    expect(keyWordOf('I can’t reproduce it on my machine.')).toBe('reproduce')
    expect(keyWordOf('Go on.')).toBeNull()
  })
})

describe('gap', () => {
  it('can gap every phrase cleanly, whatever the seed picks', () => {
    for (const set of PHRASE_SETS) {
      set.phrases.forEach((phrase, i) => {
        const word = keyWordOf(phrase.en)
        expect(word, phrase.en).not.toBeNull()
        const e = gap(set, phrase, i, word!)
        expect(e.prompt.split('___'), phrase.en).toHaveLength(2)
        expect(e.translation).toBe(phrase.uk)
        expect(checkExercise(e, word!).correct).toBe(true)
      })
    }
  })
})

describe('buildPhraseDrill', () => {
  for (const set of PHRASE_SETS) {
    it(`builds a solvable round for "${set.id}"`, () => {
      const drill = buildPhraseDrill(set, 'seed')
      expect(drill).toHaveLength(set.phrases.length)
      expect(new Set(drill.map((e) => e.id)).size).toBe(drill.length)
      expect(drill.some((e) => e.type === 'gap')).toBe(true)
      expect(drill.some((e) => e.type === 'choice')).toBe(true)
      for (const e of drill) {
        if (e.type === 'choice') {
          expect(new Set(e.options).size).toBe(4)
          expect(checkExercise(e, e.answer).correct).toBe(true)
        } else {
          expect(e.prompt.split('___')).toHaveLength(2)
          expect(checkExercise(e, e.answers[0]!).correct).toBe(true)
          expect(checkExercise(e, 'wrong').correct).toBe(false)
        }
      }
    })
  }

  it('is repeatable with the same seed and varies with another', () => {
    const set = PHRASE_SETS[0]!
    expect(buildPhraseDrill(set, 'a')).toEqual(buildPhraseDrill(set, 'a'))
    expect(buildPhraseDrill(set, 'a')).not.toEqual(buildPhraseDrill(set, 'b'))
  })
})

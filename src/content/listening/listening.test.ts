import { describe, expect, it } from 'vitest'
import { blankWord, dictationExercises, episodeExercises } from '@/features/listening/exercises'
import { checkExercise } from '@/lib/exercises/check'
import { LISTENING_EPISODES } from './index'

describe('listening content', () => {
  it('has unique episode and exercise ids', () => {
    const ids = LISTENING_EPISODES.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    const exerciseIds = LISTENING_EPISODES.flatMap((e) => episodeExercises(e).map((x) => x.id))
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length)
  })

  for (const episode of LISTENING_EPISODES) {
    it(`"${episode.id}" is consistent`, () => {
      // Every line's speaker has a name; dialogues and monologues don't mix.
      for (const line of episode.lines) expect(episode.speakers[line.speaker]).toBeTruthy()
      // Each dictation word is in its line exactly once, as a whole word, and checks right.
      const dictation = dictationExercises(episode)
      expect(dictation).toHaveLength(episode.dictation.length)
      for (const item of episode.dictation) {
        const text = episode.lines[item.line]?.en ?? ''
        const hits = text.match(new RegExp(`(?<![\\w'’])${item.word}(?![\\w'’])`, 'g')) ?? []
        expect(hits, `${item.id}: "${item.word}" in "${text}"`).toHaveLength(1)
      }
      for (const ex of dictation) {
        expect(ex.prompt.split('___'), ex.id).toHaveLength(2)
        expect(checkExercise(ex, ex.answers[0]!).correct).toBe(true)
      }
      for (const q of episode.questions) {
        expect(q.id.startsWith(`${episode.id}:`)).toBe(true)
        expect(q.options[q.answer]).toBeDefined()
      }
    })
  }

  it('blanks whole words only', () => {
    expect(blankWord('The copy of a copywriter', 'copy')).toBe('The ___ of a copywriter')
    expect(blankWord('Is it really?', 'it')).toBe('Is ___ really?')
  })
})

import { describe, expect, it } from 'vitest'
import { castVoices } from './speech'

const v = (name: string, lang: string, localService = true) => ({ name, lang, localService })

describe('castVoices', () => {
  it('gives the two speakers different English voices, local and British first', () => {
    const cast = castVoices([
      v('Thomas', 'fr-FR'),
      v('Samantha', 'en-US'),
      v('Daniel', 'en-GB'),
      v('Cloud', 'en-GB', false),
    ])
    expect(cast.A.voice?.name).toBe('Daniel')
    expect(cast.B.voice?.name).toBe('Samantha')
    expect(cast.N.voice?.name).toBe('Daniel')
  })

  it('tells speakers apart by pitch when there is only one voice', () => {
    const cast = castVoices([v('Daniel', 'en-GB')])
    expect(cast.B).toEqual({ voice: cast.A.voice, pitch: 1.25 })
  })

  it('works with no English voices', () => {
    expect(castVoices([v('Thomas', 'fr-FR')]).A.voice).toBeUndefined()
  })
})

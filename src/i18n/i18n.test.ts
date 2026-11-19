import { describe, expect, it } from 'vitest'
import { en } from './en'
import { uk } from './uk'

describe('dictionaries', () => {
  it('use correct Ukrainian plural forms', () => {
    expect(uk.vocabulary.subtitle(1)).toBe('1 слово у твоєму словнику')
    expect(uk.vocabulary.subtitle(3)).toBe('3 слова у твоєму словнику')
    expect(uk.vocabulary.subtitle(5)).toBe('5 слів у твоєму словнику')
    expect(uk.vocabulary.subtitle(12)).toBe('12 слів у твоєму словнику')
    expect(uk.vocabulary.subtitle(21)).toBe('21 слово у твоєму словнику')
    expect(uk.vocabulary.subtitle(104)).toBe('104 слова у твоєму словнику')
  })

  it('use English singular/plural', () => {
    expect(en.vocabulary.subtitle(1)).toBe('1 word in your dictionary')
    expect(en.vocabulary.subtitle(2)).toBe('2 words in your dictionary')
  })
})

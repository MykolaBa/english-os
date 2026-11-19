import { describe, expect, it } from 'vitest'
import { draftToFields, EMPTY_DRAFT, normalizeTerm, parseList, validateDraft } from './model'

describe('vocabulary model', () => {
  it('parses comma/semicolon separated lists without duplicates', () => {
    expect(parseList(' fix, solve;repair ,, fix ')).toEqual(['fix', 'solve', 'repair'])
    expect(parseList('')).toEqual([])
  })

  it('normalizes terms for duplicate detection', () => {
    expect(normalizeTerm('  Figure   Out ')).toBe('figure out')
  })

  it('requires term and translation', () => {
    expect(validateDraft(EMPTY_DRAFT)).toEqual({
      term: 'termRequired',
      translation: 'translationRequired',
    })
    expect(validateDraft({ ...EMPTY_DRAFT, term: 'deploy', translation: 'деплоїти' })).toEqual({})
    expect(validateDraft({ ...EMPTY_DRAFT, term: '   ', translation: 'x' }).term).toBe(
      'termRequired',
    )
  })

  it('turns empty optional fields into undefined', () => {
    const fields = draftToFields({
      ...EMPTY_DRAFT,
      term: ' set  up ',
      translation: ' налаштувати ',
      notes: '  ',
    })
    expect(fields.term).toBe('set up')
    expect(fields.translation).toBe('налаштувати')
    expect(fields.notes).toBeUndefined()
    expect(fields.partOfSpeech).toBeUndefined()
  })
})

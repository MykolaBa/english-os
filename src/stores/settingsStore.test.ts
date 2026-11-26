import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, sanitizeSettings } from './settingsStore'

describe('sanitizeSettings', () => {
  it('keeps valid fields and drops invalid or unknown ones', () => {
    expect(
      sanitizeSettings({
        theme: 'light',
        dailyXpGoal: '80',
        newWordsPerDay: 5,
        uiLanguage: 'fr',
        srs: { againMinutes: 5, hardDays: 1, goodDays: 2, easyDays: 4 },
        evil: '<script>',
      }),
    ).toEqual({
      theme: 'light',
      newWordsPerDay: 5,
      srs: { againMinutes: 5, hardDays: 1, goodDays: 2, easyDays: 4 },
    })
  })

  it('rejects out-of-range numbers and a broken SRS config', () => {
    expect(
      sanitizeSettings({ dailyXpGoal: 0, newWordsPerDay: 2.5, srs: { againMinutes: -1 } }),
    ).toEqual({})
  })

  it('accepts the defaults as a whole', () => {
    expect(sanitizeSettings(DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS)
  })

  it('ignores non-objects', () => {
    expect(sanitizeSettings(null)).toEqual({})
    expect(sanitizeSettings('x')).toEqual({})
  })

  it('accepts a valid study plan and rejects a broken one', () => {
    expect(
      sanitizeSettings({ studyDays: [1, 3, 5], studyMinutes: 30, studyFocus: ['reading', 'it'] }),
    ).toEqual({
      studyDays: [1, 3, 5],
      studyMinutes: 30,
      studyFocus: ['reading', 'it'],
    })
    expect(
      sanitizeSettings({ studyDays: [1, 1], studyMinutes: 25, studyFocus: ['cooking'] }),
    ).toEqual({})
  })
})

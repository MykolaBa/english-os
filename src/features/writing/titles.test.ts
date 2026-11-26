import { describe, expect, it } from 'vitest'
import { activitySubject, writingTitle } from './titles'

describe('writing titles', () => {
  it('prefers the own title, then the task title', () => {
    expect(writingTitle({ title: ' Mine ', promptId: 'bug-report' })).toBe('Mine')
    expect(writingTitle({ title: '', promptId: 'bug-report' })).toBe('Report a bug')
    expect(writingTitle({ title: '', promptId: null })).toBeNull()
    expect(writingTitle({ title: '', promptId: 'removed-task' })).toBeNull()
  })

  it('falls back to the first words for the activity feed', () => {
    expect(
      activitySubject({
        title: '',
        promptId: null,
        text: 'Today I finally fixed the flaky test in CI',
      }),
    ).toBe('Today I finally fixed the flaky…')
  })
})

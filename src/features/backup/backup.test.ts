import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { DEFAULT_SRS_CONFIG } from '@/lib/srs/scheduler'
import { useSettings } from '@/stores/settingsStore'
import { recordAnswer } from '@/features/review/reviewRepo'
import { seedStarterVocabulary } from '@/features/vocabulary/seed'
import { createBackup, getLastBackupAt, markBackupMade, parseBackup, restoreBackup } from './backup'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
  useSettings.getState().reset()
})

describe('backup', () => {
  it('round-trips all data and settings through JSON', async () => {
    await seedStarterVocabulary()
    await recordAnswer({
      wordId: 'seed:word:deploy',
      rating: 'good',
      mode: 'flashcards',
      config: DEFAULT_SRS_CONFIG,
    })
    useSettings.getState().update({ displayName: 'Mykola', dailyXpGoal: 80 })
    const json = JSON.stringify(await createBackup())

    // Wipe everything, then restore.
    await Promise.all(db.tables.map((t) => t.clear()))
    useSettings.getState().reset()
    const parsed = parseBackup(json)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.summary.reviews).toBe(1)
    await restoreBackup(parsed.backup)

    expect(await db.words.count()).toBe(parsed.summary.words)
    expect((await db.words.get('seed:word:deploy'))?.srs.status).toBe('reviewing')
    expect(await db.reviewLogs.count()).toBe(1)
    expect(useSettings.getState().displayName).toBe('Mykola')
    expect(useSettings.getState().dailyXpGoal).toBe(80)
  })

  it('rejects files that are not valid backups without touching data', async () => {
    await seedStarterVocabulary()
    const before = await db.words.count()
    expect(parseBackup('not json')).toEqual({ ok: false, problem: 'invalidJson' })
    expect(parseBackup('{"hello":1}')).toEqual({ ok: false, problem: 'notBackup' })
    expect(parseBackup('{"app":"englishos","format":99}')).toEqual({
      ok: false,
      problem: 'newerFormat',
    })

    const broken = await createBackup()
    ;(broken.data.words[0] as { term: unknown }).term = 42
    const result = parseBackup(JSON.stringify(broken))
    expect(result).toMatchObject({ ok: false, problem: 'invalidData', detail: 'data.words.0.term' })
    expect(await db.words.count()).toBe(before)
  })

  it('ignores invalid settings fields but keeps valid ones', async () => {
    const backup = await createBackup()
    backup.settings = { theme: 'neon', dailyXpGoal: 30 }
    await restoreBackup(backup)
    expect(useSettings.getState().theme).toBe('dark')
    expect(useSettings.getState().dailyXpGoal).toBe(30)
  })

  it('remembers when the last backup was made', async () => {
    expect(await getLastBackupAt()).toBeNull()
    await markBackupMade(123)
    expect(await getLastBackupAt()).toBe(123)
  })
})

describe('backup compatibility', () => {
  it('accepts a backup made before lesson progress existed', async () => {
    const old = await createBackup()
    const { lessonProgress: _dropped, ...dataWithoutLessons } = old.data
    const parsed = parseBackup(JSON.stringify({ ...old, data: dataWithoutLessons }))
    expect(parsed.ok).toBe(true)
    if (parsed.ok) expect(parsed.backup.data.lessonProgress).toEqual([])
  })

  it('accepts a backup made before reading progress existed (v3)', async () => {
    const old = await createBackup()
    const { readingProgress: _dropped, ...dataV3 } = old.data
    const parsed = parseBackup(JSON.stringify({ ...old, data: dataV3 }))
    expect(parsed.ok).toBe(true)
    if (parsed.ok) expect(parsed.backup.data.readingProgress).toEqual([])
  })

  it('round-trips interview answers and accepts v4 backups without them', async () => {
    await db.interviewAnswers.put({
      questionId: 'q1',
      answer: 'Hi',
      status: 'confident',
      createdAt: 1,
      updatedAt: 2,
    })
    const backup = await createBackup()
    const { interviewAnswers: _dropped, ...dataV4 } = backup.data
    const old = parseBackup(JSON.stringify({ ...backup, data: dataV4 }))
    expect(old.ok && old.backup.data.interviewAnswers).toEqual([])
    await db.interviewAnswers.clear()
    await restoreBackup(backup)
    expect(await db.interviewAnswers.get('q1')).toMatchObject({ answer: 'Hi' })
  })

  it('round-trips writing and accepts v5 backups without it', async () => {
    await db.writings.put({
      id: 'w1',
      promptId: null,
      title: 'Notes',
      text: 'Hello there.',
      versions: [{ at: 1, text: 'Hello.', words: 1 }],
      checked: [],
      createdAt: 1,
      updatedAt: 2,
    })
    const backup = await createBackup()
    const { writings: _dropped, ...dataV5 } = backup.data
    const old = parseBackup(JSON.stringify({ ...backup, data: dataV5 }))
    expect(old.ok && old.backup.data.writings).toEqual([])
    await db.writings.clear()
    await restoreBackup(backup)
    expect(await db.writings.get('w1')).toMatchObject({ text: 'Hello there.' })
  })

  it('round-trips listening progress and accepts v7 backups without it', async () => {
    await db.listeningProgress.put({
      episodeId: 'e1',
      attempts: 1,
      bestScore: 75,
      lastScore: 75,
      completedAt: 3,
      updatedAt: 3,
    })
    const backup = await createBackup()
    const { listeningProgress: _dropped, ...dataV7 } = backup.data
    const old = parseBackup(JSON.stringify({ ...backup, data: dataV7 }))
    expect(old.ok && old.backup.data.listeningProgress).toEqual([])
    await db.listeningProgress.clear()
    await restoreBackup(backup)
    expect(await db.listeningProgress.get('e1')).toMatchObject({ bestScore: 75 })
  })

  it('round-trips reading progress', async () => {
    await db.readingProgress.put({
      textId: 'r1',
      readAt: 5,
      attempts: 1,
      bestScore: 80,
      lastScore: 80,
      updatedAt: 5,
    })
    const backup = await createBackup()
    await db.readingProgress.clear()
    await restoreBackup(backup)
    expect(await db.readingProgress.get('r1')).toMatchObject({ bestScore: 80 })
  })
})

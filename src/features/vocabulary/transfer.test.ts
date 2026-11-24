import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/lib/db/db'
import { seedStarterVocabulary } from './seed'
import {
  applyImport,
  parseCsvImport,
  parseImportFile,
  parseJsonImport,
  planImport,
  wordsToCsv,
  wordsToJson,
} from './transfer'

beforeEach(async () => {
  await Promise.all(db.tables.map((t) => t.clear()))
})

describe('parsing imports', () => {
  it('reads a CSV with Ukrainian headers, semicolons and odd casing', () => {
    const csv =
      'Слово;Переклад;Рівень;Частина мови;Колекції\nstandup;стендап;b1;Noun;Work | Daily\n;без слова;;;\nretro;;;;'
    const parsed = parseCsvImport(csv)
    expect(parsed.rows).toHaveLength(1)
    expect(parsed.rows[0]?.draft).toMatchObject({
      term: 'standup',
      translation: 'стендап',
      level: 'B1',
      partOfSpeech: 'noun',
    })
    expect(parsed.rows[0]?.collections).toEqual(['Work', 'Daily'])
    expect(parsed.invalid).toEqual([
      { line: 3, problem: 'missingTerm' },
      { line: 4, problem: 'missingTranslation' },
    ])
  })

  it('reads a headerless two-column list', () => {
    const parsed = parseCsvImport('deploy,деплоїти\nmerge,злити')
    expect(parsed.rows.map((r) => r.draft.term)).toEqual(['deploy', 'merge'])
    expect(parsed.rows[0]?.line).toBe(1)
  })

  it('reads JSON arrays and our own export format', () => {
    expect(
      parseJsonImport('[{"word":"book","meaning":"бронювати","synonyms":["reserve"]}]').rows[0]
        ?.draft,
    ).toMatchObject({
      term: 'book',
      translation: 'бронювати',
      synonyms: 'reserve',
    })
    expect(parseJsonImport('{"words":[{"term":"a","translation":"б"}]}').rows).toHaveLength(1)
    expect(parseJsonImport('{"nope":true}').unreadable).toBe(true)
    expect(parseImportFile('words.txt', '[{"term":"x","translation":"y"}]').rows).toHaveLength(1)
  })
})

describe('planning and applying', () => {
  it('skips duplicates (existing and repeated), creates missing collections', async () => {
    await seedStarterVocabulary()
    const existing = await db.words.toArray()
    const collections = await db.collections.toArray()
    const rows = parseCsvImport(
      'term,translation,collections\nDeploy,x,\nstandup,стендап,Travel|Sprint\nstandup,again,',
    ).rows
    const plan = planImport(rows, existing, collections)
    expect(plan.toAdd.map((r) => r.draft.term)).toEqual(['standup'])
    expect(plan.duplicates).toEqual(['Deploy', 'standup'])
    expect(plan.newCollections).toEqual(['Sprint'])

    expect(await applyImport(plan)).toBe(1)
    const word = (await db.words.toArray()).find((w) => w.term === 'standup')
    const sprint = (await db.collections.toArray()).find((c) => c.name === 'Sprint')
    expect(word?.collectionIds).toContain('seed:collection:travel')
    expect(word?.collectionIds).toContain(sprint?.id)
    expect(word?.srs.status).toBe('new')
    expect(await db.activity.count()).toBe(0) // no XP for importing
  })

  it('gives a word each collection once, even when the file repeats it', async () => {
    await seedStarterVocabulary()
    const rows = parseCsvImport(
      'term,translation,collections\nsprint,спринт,Travel|travel|Travel',
    ).rows
    await applyImport(planImport(rows, [], await db.collections.toArray()))
    const word = (await db.words.toArray()).find((w) => w.term === 'sprint')
    expect(word?.collectionIds).toEqual(['seed:collection:travel'])
  })

  it('round-trips through CSV and JSON exports', async () => {
    await seedStarterVocabulary()
    const words = await db.words.toArray()
    const collections = await db.collections.toArray()
    const fromCsv = parseCsvImport(wordsToCsv(words, collections))
    const fromJson = parseJsonImport(wordsToJson(words, collections))
    expect(fromCsv.rows).toHaveLength(words.length)
    expect(fromJson.rows).toHaveLength(words.length)
    expect(fromCsv.invalid).toEqual([])
    const deploy = fromCsv.rows.find((r) => r.draft.term === 'deploy')
    expect(deploy?.collections).toEqual(['IT & Programming'])
    expect(deploy?.draft.phonetic).toBe('/dɪˈplɔɪ/')
  })
})

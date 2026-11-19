import { parseCsv, toCsv } from '@/lib/csv'
import { db } from '@/lib/db/db'
import { CEFR_LEVELS, type Collection, type Word } from '@/lib/db/types'
import { parseOneOf } from '@/lib/guards'
import { createId } from '@/lib/id'
import {
  createInitialSrs,
  draftToFields,
  EMPTY_DRAFT,
  normalizeTerm,
  PARTS_OF_SPEECH,
  validateDraft,
  type WordDraft,
} from './model'

/**
 * Vocabulary import/export (CSV and JSON). Pure parsing and planning are separate from
 * writing, so the import dialog can show exactly what will happen before anything is saved.
 */

const FIELDS = [
  'term',
  'translation',
  'definition',
  'phonetic',
  'partOfSpeech',
  'level',
  'example',
  'exampleTranslation',
  'collections',
  'synonyms',
  'antonyms',
  'collocations',
  'notes',
] as const
type Field = (typeof FIELDS)[number]

/** Column names we understand (English, Ukrainian and common app exports). */
const ALIASES: Record<Field, string[]> = {
  term: ['term', 'word', 'phrase', 'english', 'front', 'слово', 'англійська', 'фраза'],
  translation: [
    'translation',
    'ukrainian',
    'meaning',
    'back',
    'переклад',
    'українська',
    'значення',
  ],
  definition: ['definition', 'визначення'],
  phonetic: ['phonetic', 'ipa', 'transcription', 'pronunciation', 'транскрипція'],
  partOfSpeech: ['partofspeech', 'pos', 'частинамови'],
  level: ['level', 'cefr', 'рівень'],
  example: ['example', 'sentence', 'приклад'],
  exampleTranslation: ['exampletranslation', 'перекладприкладу'],
  collections: ['collections', 'collection', 'tags', 'колекції', 'колекція'],
  synonyms: ['synonyms', 'синоніми'],
  antonyms: ['antonyms', 'антоніми'],
  collocations: ['collocations', 'сполучення'],
  notes: ['notes', 'note', 'нотатки', 'примітки'],
}

const normalizeKey = (key: string) => key.toLowerCase().replace(/[\s_\-.]/g, '')
const FIELD_BY_ALIAS = new Map(
  FIELDS.flatMap((field) => ALIASES[field].map((alias) => [alias, field] as const)),
)

export interface ImportRow {
  /** 1-based line in the file (CSV) or position (JSON), for error messages. */
  line: number
  draft: WordDraft
  collections: string[]
}

export type RowProblem = 'missingTerm' | 'missingTranslation'

export interface ParsedImport {
  rows: ImportRow[]
  invalid: { line: number; problem: RowProblem }[]
  /** No usable rows at all — wrong file type or layout. */
  unreadable: boolean
}

const splitCollections = (value: string) =>
  value
    .split(/[|;]/)
    .map((s) => s.trim())
    .filter(Boolean)

function recordToRow(record: Partial<Record<Field, string>>, line: number): ImportRow {
  const get = (f: Field) => (record[f] ?? '').trim()
  return {
    line,
    collections: splitCollections(get('collections')),
    draft: {
      ...EMPTY_DRAFT,
      term: get('term'),
      translation: get('translation'),
      definition: get('definition'),
      phonetic: get('phonetic'),
      partOfSpeech: parseOneOf(PARTS_OF_SPEECH, get('partOfSpeech').toLowerCase()) ?? '',
      level: parseOneOf(CEFR_LEVELS, get('level').toUpperCase()) ?? '',
      example: get('example'),
      exampleTranslation: get('exampleTranslation'),
      synonyms: get('synonyms'),
      antonyms: get('antonyms'),
      collocations: get('collocations'),
      notes: get('notes'),
    },
  }
}

function validate(rows: ImportRow[]): ParsedImport {
  const valid: ImportRow[] = []
  const invalid: ParsedImport['invalid'] = []
  for (const row of rows) {
    const errors = validateDraft(row.draft)
    if (errors.term) invalid.push({ line: row.line, problem: 'missingTerm' })
    else if (errors.translation) invalid.push({ line: row.line, problem: 'missingTranslation' })
    else valid.push(row)
  }
  return { rows: valid, invalid, unreadable: valid.length === 0 && invalid.length === 0 }
}

/** CSV with a header row (any known column names), or a headerless "word, translation" list. */
export function parseCsvImport(text: string): ParsedImport {
  const table = parseCsv(text)
  const header = (table[0] ?? []).map((cell) => FIELD_BY_ALIAS.get(normalizeKey(cell)))
  const hasHeader = header.includes('term') || header.includes('translation')
  const columns: (Field | undefined)[] = hasHeader
    ? header
    : ['term', 'translation', 'example', 'exampleTranslation']
  const body = hasHeader ? table.slice(1) : table
  const firstLine = hasHeader ? 2 : 1

  return validate(
    body.map((cells, i) => {
      const record: Partial<Record<Field, string>> = {}
      columns.forEach((field, c) => {
        if (field && cells[c] !== undefined) record[field] = cells[c]
      })
      return recordToRow(record, firstLine + i)
    }),
  )
}

/** Our own JSON export, or any array of objects with recognizable keys. */
export function parseJsonImport(text: string): ParsedImport {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { rows: [], invalid: [], unreadable: true }
  }
  const items = Array.isArray(json) ? json : (json as { words?: unknown })?.words
  if (!Array.isArray(items)) return { rows: [], invalid: [], unreadable: true }

  return validate(
    items.map((item, i) => {
      const record: Partial<Record<Field, string>> = {}
      if (typeof item === 'object' && item !== null) {
        for (const [key, value] of Object.entries(item)) {
          const field = FIELD_BY_ALIAS.get(normalizeKey(key))
          if (!field) continue
          record[field] = Array.isArray(value)
            ? value.join(field === 'collections' ? ' | ' : ', ')
            : typeof value === 'string' || typeof value === 'number'
              ? String(value)
              : ''
        }
      }
      return recordToRow(record, i + 1)
    }),
  )
}

export function parseImportFile(filename: string, text: string): ParsedImport {
  const looksJson = filename.toLowerCase().endsWith('.json') || /^\s*[[{]/.test(text)
  return looksJson ? parseJsonImport(text) : parseCsvImport(text)
}

export interface ImportPlan {
  toAdd: ImportRow[]
  /** Terms already in the vocabulary (or repeated in the file) — skipped, never overwritten. */
  duplicates: string[]
  /** Collection names that don't exist yet and will be created. */
  newCollections: string[]
}

export function planImport(
  rows: ImportRow[],
  existing: Word[],
  collections: Collection[],
): ImportPlan {
  const known = new Set(existing.map((w) => normalizeTerm(w.term)))
  const knownCollections = new Set(collections.map((c) => c.name.toLowerCase()))
  const toAdd: ImportRow[] = []
  const duplicates: string[] = []
  const newCollections = new Map<string, string>()

  for (const row of rows) {
    const key = normalizeTerm(row.draft.term)
    if (known.has(key)) {
      duplicates.push(row.draft.term)
      continue
    }
    known.add(key)
    toAdd.push(row)
    for (const name of row.collections) {
      if (!knownCollections.has(name.toLowerCase())) newCollections.set(name.toLowerCase(), name)
    }
  }
  return { toAdd, duplicates, newCollections: [...newCollections.values()] }
}

/**
 * Writes the plan in one transaction. Imported words start as new and earn no XP —
 * XP is for learning, not for moving files around.
 */
export async function applyImport(plan: ImportPlan, now = Date.now()): Promise<number> {
  return db.transaction('rw', db.words, db.collections, async () => {
    const byName = new Map(
      (await db.collections.toArray()).map((c) => [c.name.toLowerCase(), c.id]),
    )
    for (const name of plan.newCollections) {
      if (byName.has(name.toLowerCase())) continue
      const id = createId()
      await db.collections.add({ id, name, icon: 'folder', source: 'user', createdAt: now })
      byName.set(name.toLowerCase(), id)
    }
    const words: Word[] = plan.toAdd.map((row, i) => {
      const createdAt = now - i // keep file order under "newest first"
      const collectionIds = row.collections.flatMap((name) => byName.get(name.toLowerCase()) ?? [])
      return {
        ...draftToFields({ ...row.draft, collectionIds }),
        id: createId(),
        favorite: false,
        source: 'user',
        createdAt,
        updatedAt: createdAt,
        srs: createInitialSrs(createdAt),
      }
    })
    await db.words.bulkAdd(words)
    return words.length
  })
}

// ---------- Export ----------

const collectionNames = (word: Word, collections: Collection[]) =>
  collections.filter((c) => word.collectionIds.includes(c.id)).map((c) => c.name)

export function wordsToCsv(words: Word[], collections: Collection[]): string {
  return toCsv([
    [...FIELDS, 'status'],
    ...words.map((w) => [
      w.term,
      w.translation,
      w.definition,
      w.phonetic,
      w.partOfSpeech,
      w.level,
      w.example,
      w.exampleTranslation,
      collectionNames(w, collections).join(' | '),
      w.synonyms.join(', '),
      w.antonyms.join(', '),
      w.collocations.join(', '),
      w.notes,
      w.srs.status,
    ]),
  ])
}

export function wordsToJson(words: Word[], collections: Collection[], now = new Date()): string {
  return JSON.stringify(
    {
      format: 'englishos-words',
      version: 1,
      exportedAt: now.toISOString(),
      words: words.map((w) => ({
        term: w.term,
        translation: w.translation,
        definition: w.definition,
        phonetic: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        level: w.level,
        example: w.example,
        exampleTranslation: w.exampleTranslation,
        collections: collectionNames(w, collections),
        synonyms: w.synonyms,
        antonyms: w.antonyms,
        collocations: w.collocations,
        notes: w.notes,
        status: w.srs.status,
      })),
    },
    null,
    2,
  )
}

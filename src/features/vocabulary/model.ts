import { z } from 'zod'
import type { CefrLevel, PartOfSpeech, SrsState, Word } from '@/lib/db/types'
import { parseOneOf } from '@/lib/guards'

export const PARTS_OF_SPEECH = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrasal verb',
  'phrase',
  'idiom',
  'preposition',
  'conjunction',
  'pronoun',
  'other',
] as const satisfies readonly PartOfSpeech[]

/** A word that has never been reviewed. The review session (phase 3) moves it forward. */
export function createInitialSrs(now: number): SrsState {
  return {
    status: 'new',
    dueAt: now,
    intervalDays: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    correctCount: 0,
    incorrectCount: 0,
  }
}

/** Case- and whitespace-insensitive key used to detect duplicates. */
export function normalizeTerm(term: string): string {
  return term.trim().replace(/\s+/g, ' ').toLowerCase()
}

/** "fix, solve;  repair" → ['fix', 'solve', 'repair'] (trimmed, no duplicates). */
export function parseList(value: string): string[] {
  const items = value
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
  return [...new Set(items)]
}

/** What the add/edit form works with: plain strings, exactly like the inputs. */
export interface WordDraft {
  term: string
  translation: string
  definition: string
  phonetic: string
  partOfSpeech: PartOfSpeech | ''
  level: CefrLevel | ''
  example: string
  exampleTranslation: string
  collectionIds: string[]
  synonyms: string
  antonyms: string
  collocations: string
  notes: string
}

export const EMPTY_DRAFT: WordDraft = {
  term: '',
  translation: '',
  definition: '',
  phonetic: '',
  partOfSpeech: '',
  level: '',
  example: '',
  exampleTranslation: '',
  collectionIds: [],
  synonyms: '',
  antonyms: '',
  collocations: '',
  notes: '',
}

/**
 * Validation schema. Error messages are i18n keys, so the form can show them in the
 * current interface language.
 */
export const wordDraftSchema = z.object({
  term: z.string().trim().min(1, 'termRequired').max(120),
  translation: z.string().trim().min(1, 'translationRequired').max(300),
})

const DRAFT_ERROR_KEYS = ['termRequired', 'translationRequired'] as const
export type WordDraftErrorKey = (typeof DRAFT_ERROR_KEYS)[number]
export type WordDraftErrors = Partial<Record<'term' | 'translation', WordDraftErrorKey>>

export function validateDraft(draft: WordDraft): WordDraftErrors {
  const result = wordDraftSchema.safeParse(draft)
  if (result.success) return {}
  const errors: WordDraftErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (field === 'term' || field === 'translation') {
      errors[field] ??= parseOneOf(DRAFT_ERROR_KEYS, issue.message) ?? 'termRequired'
    }
  }
  return errors
}

const optional = (value: string) => value.trim() || undefined

/** Form strings → the editable fields of a Word (trimmed, empty strings become undefined). */
export function draftToFields(draft: WordDraft) {
  return {
    term: draft.term.trim().replace(/\s+/g, ' '),
    translation: draft.translation.trim(),
    definition: optional(draft.definition),
    phonetic: optional(draft.phonetic),
    partOfSpeech: draft.partOfSpeech || undefined,
    level: draft.level || undefined,
    example: optional(draft.example),
    exampleTranslation: optional(draft.exampleTranslation),
    collectionIds: [...new Set(draft.collectionIds)],
    synonyms: parseList(draft.synonyms),
    antonyms: parseList(draft.antonyms),
    collocations: parseList(draft.collocations),
    notes: optional(draft.notes),
  } satisfies Partial<Word>
}

export function wordToDraft(word: Word): WordDraft {
  return {
    term: word.term,
    translation: word.translation,
    definition: word.definition ?? '',
    phonetic: word.phonetic ?? '',
    partOfSpeech: word.partOfSpeech ?? '',
    level: word.level ?? '',
    example: word.example ?? '',
    exampleTranslation: word.exampleTranslation ?? '',
    collectionIds: word.collectionIds,
    synonyms: word.synonyms.join(', '),
    antonyms: word.antonyms.join(', '),
    collocations: word.collocations.join(', '),
    notes: word.notes ?? '',
  }
}

/** Share of correct answers, or null if the word was never answered. */
export function accuracy(srs: SrsState): number | null {
  const total = srs.correctCount + srs.incorrectCount
  return total === 0 ? null : srs.correctCount / total
}

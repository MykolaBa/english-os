import type { PartOfSpeech } from './types'

/**
 * Value lists and size limits of a Word, shared by the add-word form, imports and the
 * backup schema — one source, so a word the form accepts always survives a restore.
 */

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

/** Limits shared by the form (maxLength), imports and backups. */
export const TERM_MAX = 120
export const TRANSLATION_MAX = 300
/**
 * Every other text field. The backup schema uses the same number: a longer note would
 * save fine but make the whole backup fail to restore.
 */
export const TEXT_MAX = 5000

/** A piece of writing, its title, and how many versions are kept (oldest are dropped). */
export const WRITING_MAX = 20_000
export const WRITING_TITLE_MAX = 120
export const WRITING_VERSIONS_MAX = 30

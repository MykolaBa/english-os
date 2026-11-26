import type { ReadingText } from '@/content/reading'

/** Anything the reader can show: a graded text, or a library item (no glossary). */
export type ReaderSource = Pick<ReadingText, 'paragraphs' | 'glossary'>
import type { Word } from '@/lib/db/types'
import { normalizeTerm, type WordDraft } from '@/features/vocabulary/model'
import { findKnownWord, tokenizeParagraph, wordKey } from './tokenize'

/** What the learner tapped: the word as written, its sentence and, for key words, the glossary entry. */
export interface WordSelection {
  id: string
  text: string
  sentence: string
  glossIndex?: number
}

/**
 * A capitalised word that opens its sentence is an ordinary word ("Many" → "many");
 * anywhere else capitals mean something ("DNS", "Olena"), so it's kept as written.
 */
function termFor(selection: WordSelection): string {
  const opensSentence = selection.sentence.trimStart().startsWith(selection.text)
  return opensSentence && /^\p{Lu}\p{Ll}*$/u.test(selection.text)
    ? selection.text.toLowerCase()
    : selection.text
}

/** What "Add to vocabulary" prefills: the key word's dictionary form, or the tapped word. */
export function draftFor(text: ReaderSource, selection: WordSelection): Partial<WordDraft> {
  const gloss = selection.glossIndex === undefined ? undefined : text.glossary[selection.glossIndex]
  return {
    term: gloss?.term ?? termFor(selection),
    translation: gloss?.translation ?? '',
    partOfSpeech: gloss?.partOfSpeech ?? '',
    example: selection.sentence,
  }
}

/** The first sentence that uses a key word — the example saved with it. */
export function glossSentence(text: ReaderSource, index: number): string {
  for (const p of text.paragraphs) {
    for (const s of tokenizeParagraph(p, text.glossary)) {
      if (s.tokens.some((tk) => tk.kind === 'gloss' && tk.index === index)) return s.text
    }
  }
  return ''
}

export interface KnownMatch {
  word: Word
  /** False when only a guessed base form matched ("news" found "new"): maybe a different word. */
  exact: boolean
}

/** The learner's saved word for the selection, if any. */
export function knownFor(
  text: ReaderSource,
  s: WordSelection,
  vocabulary: Map<string, Word>,
): KnownMatch | undefined {
  const gloss = s.glossIndex === undefined ? undefined : text.glossary[s.glossIndex]
  const word = gloss ? vocabulary.get(normalizeTerm(gloss.term)) : findKnownWord(s.text, vocabulary)
  if (!word) return undefined
  return { word, exact: gloss !== undefined || normalizeTerm(word.term) === wordKey(s.text) }
}

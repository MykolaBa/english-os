import type { GlossaryItem } from '@/content/reading/types'

/**
 * Splits a paragraph into sentences and tokens, so every word can be tapped.
 * Glossary phrases ("run out of") become a single token; everything else is a word,
 * or plain text (spaces and punctuation) that isn't interactive.
 */
export type Token =
  | { kind: 'text'; text: string }
  | { kind: 'word'; text: string }
  | { kind: 'gloss'; text: string; index: number }

export interface Sentence {
  text: string
  tokens: Token[]
}

/** Letters with inner apostrophes or hyphens: "don't", "front-end", "user’s". */
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Glossary forms, longest first, so "pull request" wins over "request". */
function glossPattern(glossary: readonly GlossaryItem[]): RegExp | null {
  const forms = glossary
    .map((g, index) => ({ form: g.form ?? g.term, index }))
    .toSorted((a, b) => b.form.length - a.form.length)
  if (forms.length === 0) return null
  const alternatives = forms.map((f) => `(?<g${f.index}>${escape(f.form)})`).join('|')
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?![\\p{L}\\p{N}])`, 'giu')
}

function splitWords(text: string, out: Token[]) {
  let last = 0
  for (const m of text.matchAll(WORD)) {
    if (m.index > last) out.push({ kind: 'text', text: text.slice(last, m.index) })
    out.push({ kind: 'word', text: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) })
}

function tokenizeSentence(text: string, pattern: RegExp | null): Token[] {
  const tokens: Token[] = []
  let last = 0
  if (pattern) {
    for (const m of text.matchAll(pattern)) {
      const hit = Object.entries(m.groups ?? {}).find(([, v]) => v !== undefined)
      if (!hit) continue
      splitWords(text.slice(last, m.index), tokens)
      tokens.push({ kind: 'gloss', text: m[0], index: Number(hit[0].slice(1)) })
      last = m.index + m[0].length
    }
  }
  splitWords(text.slice(last), tokens)
  return tokens
}

/** Sentence boundaries: after . ! ? (and a closing quote), before whitespace. */
const SENTENCE_END = /(?<=[.!?]["”’)]?)\s+/u

export function tokenizeParagraph(
  paragraph: string,
  glossary: readonly GlossaryItem[],
): Sentence[] {
  const pattern = glossPattern(glossary)
  return paragraph
    .split(SENTENCE_END)
    .filter(Boolean)
    .map((text) => ({ text, tokens: tokenizeSentence(text, pattern) }))
}

export { findKnownWord, lookupKeys, wordKey } from '@/lib/text/lemma'

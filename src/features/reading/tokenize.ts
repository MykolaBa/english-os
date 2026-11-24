import type { GlossaryItem } from '@/content/reading/types'
import type { Word } from '@/lib/db/types'

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

/** "Deploys," → "deploys": the key used to look a tapped word up in the vocabulary. */
export const wordKey = (text: string) => text.toLowerCase().replace(/’/g, "'")

/**
 * Keys to try when looking a tapped word up in the vocabulary: the word itself, then
 * simple base forms ("deploys" → "deploy", "fixed" → "fix", "running" → "run").
 * A rough guess on purpose — no dictionary is shipped; a miss only means no match.
 */
export function lookupKeys(text: string): string[] {
  const key = wordKey(text).replace(/'s$/, '')
  const keys = [key]
  const add = (k: string) => k.length > 1 && !keys.includes(k) && keys.push(k)
  if (key.endsWith('ies')) add(`${key.slice(0, -3)}y`)
  if (key.endsWith('es')) add(key.slice(0, -2))
  if (key.endsWith('s')) add(key.slice(0, -1))
  if (key.endsWith('ied')) add(`${key.slice(0, -3)}y`)
  if (key.endsWith('ed')) {
    add(key.slice(0, -2))
    add(key.slice(0, -1))
  }
  if (key.endsWith('ing')) {
    add(key.slice(0, -3))
    add(`${key.slice(0, -3)}e`)
  }
  // Doubled final consonant: "stopped" → "stop", "running" → "run".
  const stem = key.replace(/(ed|ing)$/, '')
  if (stem !== key && /([b-df-hj-np-tv-z])\1$/.test(stem)) add(stem.slice(0, -1))
  return keys
}

/** The learner's word for a tapped form, if any ("deploys" finds "deploy"). */
export const findKnownWord = (text: string, vocabulary: Map<string, Word>): Word | undefined =>
  lookupKeys(text)
    .map((k) => vocabulary.get(k))
    .find((w) => w !== undefined)

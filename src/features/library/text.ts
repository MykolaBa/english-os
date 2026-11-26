import { LIBRARY_TAG_MAX, LIBRARY_TAGS_MAX, URL_MAX } from '@/lib/db/limits'
import type { LibraryItem, LibraryStatus, Word } from '@/lib/db/types'
import { findKnownWord, lookupKeys, wordKey } from '@/lib/text/lemma'
import { STOPWORDS } from '@/lib/text/stopwords'

/**
 * A link the app will open: http or https only (never javascript: or data:). A bare
 * domain gets https://. Returns null for anything else.
 */
export function safeUrl(input: string): string | null {
  const raw = input.trim()
  if (!raw || raw.length > URL_MAX) return null
  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`
  try {
    const url = new URL(withScheme)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

/** "React, docs ,react" → ["react", "docs"]: trimmed, lower case, no repeats, capped. */
export function parseTags(input: string): string[] {
  const tags = input
    .split(',')
    .map((t) => t.trim().toLowerCase().slice(0, LIBRARY_TAG_MAX))
    .filter(Boolean)
  return [...new Set(tags)].slice(0, LIBRARY_TAGS_MAX)
}

/**
 * Paragraphs from pasted text: blank lines separate them; single line breaks (hard-wrapped
 * text from emails and PDFs) are joined back into one line.
 */
export function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

const WORD = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g

/** Words that carry meaning: not function words, at least three letters. */
const contentWords = (text: string) =>
  (text.match(WORD) ?? []).map(wordKey).filter((w) => w.length >= 3 && !STOPWORDS.has(w))

/** In the learner's vocabulary, or a very common word (any simple form of either). */
function isFamiliar(word: string, vocabulary: Map<string, Word>, common: ReadonlySet<string>) {
  return (
    findKnownWord(word, vocabulary) !== undefined || lookupKeys(word).some((k) => common.has(k))
  )
}

/**
 * How much of the text's vocabulary is already familiar: content words you have saved or
 * that are very common, against all content words.
 */
export function coverage(
  text: string,
  vocabulary: Map<string, Word>,
  common: ReadonlySet<string> = new Set(),
) {
  const words = contentWords(text)
  const known = words.filter((w) => isFamiliar(w, vocabulary, common)).length
  return {
    words: words.length,
    percent: words.length ? Math.round((known / words.length) * 100) : 0,
  }
}

export interface UnknownWord {
  word: string
  count: number
  /** The first sentence it appears in — the example saved with it. */
  sentence: string
}

/**
 * New words worth learning from this text, most frequent first. Forms of one word are
 * counted together ("deployment", "deployments") and shown in their shortest form.
 * Sentences are cut per paragraph, so a heading without a full stop stays apart.
 */
export function unknownWords(
  text: string,
  vocabulary: Map<string, Word>,
  common: ReadonlySet<string> = new Set(),
  limit = 12,
): UnknownWord[] {
  const groups: UnknownWord[] = []
  const byKey = new Map<string, UnknownWord>()
  for (const paragraph of splitParagraphs(text)) {
    for (const raw of paragraph.match(/[^.!?]+[.!?]*/g) ?? []) {
      const sentence = raw.trim()
      for (const word of contentWords(sentence)) {
        if (isFamiliar(word, vocabulary, common)) continue
        const keys = lookupKeys(word)
        const existing = keys.map((k) => byKey.get(k)).find((g) => g !== undefined)
        const group = existing ?? { word, count: 0, sentence }
        if (!existing) groups.push(group)
        group.count += 1
        if (word.length < group.word.length) group.word = word
        // Every form seen points to the group, so later forms join it.
        for (const k of keys) if (!byKey.has(k)) byKey.set(k, group)
      }
    }
  }
  // Stable sort: equal counts keep the order they first appear in.
  return groups.toSorted((a, b) => b.count - a.count).slice(0, limit)
}

/**
 * A heading at the top of pasted or imported text: a short first paragraph (up to 12
 * words) that doesn't end like a sentence. Null when the text starts with prose.
 */
export function guessTitle(text: string): string | null {
  const first = splitParagraphs(text)[0]
  if (!first) return null
  const words = first.split(/\s+/).length
  return words <= 12 && !/[.!?:;,]$/.test(first) ? first : null
}

export interface LibraryFilters {
  query: string
  status: LibraryStatus | null
  tag: string | null
}

export function filterLibrary(items: readonly LibraryItem[], f: LibraryFilters): LibraryItem[] {
  const q = f.query.trim().toLowerCase()
  return items.filter(
    (i) =>
      (!f.status || i.status === f.status) &&
      (!f.tag || i.tags.includes(f.tag)) &&
      (!q || i.title.toLowerCase().includes(q) || i.text.toLowerCase().includes(q)),
  )
}

/** Every tag in use, most used first — the tag filter's options. */
export function tagsInUse(items: readonly LibraryItem[]): string[] {
  const counts = new Map<string, number>()
  for (const i of items) for (const t of i.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts].toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t)
}

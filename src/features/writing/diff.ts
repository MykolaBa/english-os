/**
 * Word-level difference between two versions of a text, for "what changed".
 * Tokens are words or punctuation with their trailing spaces; they're compared without
 * the spaces (so "done." and "done ." differ only in "."), and unchanged parts show the
 * newer text, so joining the non-removed segments rebuilds the new version exactly.
 */

export interface DiffSegment {
  type: 'same' | 'added' | 'removed'
  text: string
}

/** Beyond this many cells the full comparison is skipped (memory on phones). */
const MAX_CELLS = 4_000_000

const tokenize = (text: string) => text.match(/[\w'’-]+\s*|[^\w\s]\s*|\s+/g) ?? []
const key = (token: string) => token.trim()

function push(out: DiffSegment[], type: DiffSegment['type'], text: string) {
  const last = out.at(-1)
  if (last?.type === type) last.text += text
  else if (text) out.push({ type, text })
}

export function diffWords(before: string, after: string): DiffSegment[] {
  const a = tokenize(before)
  const b = tokenize(after)
  // Edits are usually local: compare only the part between the common start and end.
  let start = 0
  while (start < a.length && start < b.length && key(a[start]!) === key(b[start]!)) start++
  let endA = a.length
  let endB = b.length
  while (endA > start && endB > start && key(a[endA - 1]!) === key(b[endB - 1]!)) {
    endA--
    endB--
  }
  const out: DiffSegment[] = []
  push(out, 'same', b.slice(0, start).join(''))
  const midA = a.slice(start, endA)
  const midB = b.slice(start, endB)

  if (midA.length * midB.length > MAX_CELLS) {
    push(out, 'removed', midA.join(''))
    push(out, 'added', midB.join(''))
  } else {
    // Longest common subsequence, then walk it to emit same / removed / added runs.
    const n = midA.length
    const m = midB.length
    const keysA = midA.map(key)
    const keysB = midB.map(key)
    const lcs = new Uint32Array((n + 1) * (m + 1))
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        lcs[i * (m + 1) + j] =
          keysA[i] === keysB[j]
            ? lcs[(i + 1) * (m + 1) + j + 1]! + 1
            : Math.max(lcs[(i + 1) * (m + 1) + j]!, lcs[i * (m + 1) + j + 1]!)
      }
    }
    let i = 0
    let j = 0
    while (i < n && j < m) {
      if (keysA[i] === keysB[j]) {
        push(out, 'same', midB[j++]!)
        i++
      } else if (lcs[(i + 1) * (m + 1) + j]! >= lcs[i * (m + 1) + j + 1]!) {
        push(out, 'removed', midA[i++]!)
      } else {
        push(out, 'added', midB[j++]!)
      }
    }
    push(out, 'removed', midA.slice(i).join(''))
    push(out, 'added', midB.slice(j).join(''))
  }
  push(out, 'same', b.slice(endB).join(''))
  return out
}

/** How many words were added and removed — the summary next to a version. */
export function diffStats(segments: readonly DiffSegment[]): { added: number; removed: number } {
  const words = (s: string) => s.match(/\S+/g)?.length ?? 0
  let added = 0
  let removed = 0
  for (const seg of segments) {
    if (seg.type === 'added') added += words(seg.text)
    if (seg.type === 'removed') removed += words(seg.text)
  }
  return { added, removed }
}

/**
 * Inserts a phrase at the cursor (replacing a selection), adding a space when it would
 * stick to the previous word. Returns the new text and what to select next: the first
 * "…" placeholder in the phrase (so typing replaces it), or just after the phrase.
 */
export function insertAt(
  text: string,
  phrase: string,
  start: number,
  end: number = start,
): { text: string; selection: [number, number] } {
  const before = text.slice(0, start)
  const piece = (before && !/\s$/.test(before) ? ' ' : '') + phrase
  const at = before.length
  const dots = piece.indexOf('…')
  return {
    text: before + piece + text.slice(end),
    selection: dots >= 0 ? [at + dots, at + dots + 1] : [at + piece.length, at + piece.length],
  }
}

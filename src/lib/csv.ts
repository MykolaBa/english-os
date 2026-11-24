/**
 * Minimal RFC 4180 CSV: quoted fields, "" escapes, newlines inside quotes, BOM.
 * The delimiter is detected, because Excel with a Ukrainian locale saves with ";".
 */

import { isOneOf } from './guards'

const DELIMITERS = [',', ';', '\t'] as const
export type CsvDelimiter = (typeof DELIMITERS)[number]

/** Picks the delimiter that occurs most often in the first line (outside quotes). */
export function detectDelimiter(text: string): CsvDelimiter {
  const counts: Record<CsvDelimiter, number> = { ',': 0, ';': 0, '\t': 0 }
  let quoted = false
  for (const ch of text) {
    if (ch === '"') quoted = !quoted
    else if (!quoted && (ch === '\n' || ch === '\r')) break
    else if (!quoted && isOneOf(DELIMITERS, ch)) counts[ch]++
  }
  const best = DELIMITERS.toSorted((a, b) => counts[b] - counts[a])[0]
  return best && counts[best] > 0 ? best : ','
}

export function parseCsv(
  input: string,
  delimiter: CsvDelimiter = detectDelimiter(input),
): string[][] {
  const text = input.replace(/^﻿/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        quoted = false
      } else {
        field += ch
      }
    } else if (ch === '"' && field === '') {
      quoted = true
    } else if (ch === delimiter) {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += ch
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  // Drop fully empty lines (common at the end of files).
  return rows.filter((r) => r.some((cell) => cell.trim() !== '')).map((r) => r.map(unescapeFormula))
}

/**
 * Spreadsheet apps run a cell that starts with = + - @ (or a tab / CR) as a formula —
 * "CSV injection". Exported cells like that get a leading apostrophe, which Excel and
 * Sheets show as plain text; our own import removes it again.
 */
const FORMULA_START = /^[=+\-@\t\r]/
const escapeFormula = (text: string) => (FORMULA_START.test(text) ? `'${text}` : text)
const unescapeFormula = (text: string) =>
  text.startsWith("'") && FORMULA_START.test(text.slice(1)) ? text.slice(1) : text

const needsQuotes = /[",;\t\r\n]/

export function toCsv(rows: ReadonlyArray<ReadonlyArray<string | number | undefined>>): string {
  const line = (cells: ReadonlyArray<string | number | undefined>) =>
    cells
      .map((cell) => {
        const text = escapeFormula(cell === undefined ? '' : String(cell))
        return needsQuotes.test(text) ? `"${text.replace(/"/g, '""')}"` : text
      })
      .join(',')
  // BOM so Excel opens UTF-8 (Cyrillic, IPA) correctly.
  return '﻿' + rows.map(line).join('\r\n') + '\r\n'
}

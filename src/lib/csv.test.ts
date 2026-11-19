import { describe, expect, it } from 'vitest'
import { detectDelimiter, parseCsv, toCsv } from './csv'

describe('csv', () => {
  it('parses quotes, escaped quotes, newlines inside fields and a BOM', () => {
    const text =
      '﻿term,translation,example\r\n"set up","налаштувати","Let\'s ""set up"" it,\nnow"\r\nbook,бронювати,\n\n'
    expect(parseCsv(text)).toEqual([
      ['term', 'translation', 'example'],
      ['set up', 'налаштувати', 'Let\'s "set up" it,\nnow'],
      ['book', 'бронювати', ''],
    ])
  })

  it('detects semicolon and tab delimiters', () => {
    expect(detectDelimiter('term;translation\nbook;бронювати')).toBe(';')
    expect(detectDelimiter('term\ttranslation')).toBe('\t')
    expect(detectDelimiter('"a;b",c')).toBe(',')
    expect(parseCsv('term;translation\nbook;бронювати')).toEqual([
      ['term', 'translation'],
      ['book', 'бронювати'],
    ])
  })

  it('round-trips through toCsv', () => {
    const rows = [
      ['term', 'notes'],
      ['deploy', 'said "ship it", then\nleft'],
    ]
    expect(parseCsv(toCsv(rows))).toEqual(rows)
  })
})

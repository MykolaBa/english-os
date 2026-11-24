import { useMemo, type MouseEvent } from 'react'
import type { ReadingText } from '@/content/reading'
import { cx } from '@/lib/cx'
import type { Word } from '@/lib/db/types'
import type { WordSelection } from '../selection'
import { findKnownWord, tokenizeParagraph } from '../tokenize'
import styles from '../Reading.module.scss'

interface ReadingArticleProps {
  text: ReadingText
  vocabulary: Map<string, Word>
  selectedId: string | null
  onSelect: (selection: WordSelection) => void
}

/**
 * The text with every word tappable. Key words are real buttons (keyboard users reach them
 * with Tab); ordinary words are plain spans handled by one click listener on the article,
 * so 300 words don't mean 300 tab stops or 300 handlers.
 */
export function ReadingArticle({ text, vocabulary, selectedId, onSelect }: ReadingArticleProps) {
  const paragraphs = useMemo(() => {
    const selections = new Map<string, WordSelection>()
    const rendered = text.paragraphs.map((p, pi) =>
      tokenizeParagraph(p, text.glossary).map((sentence, si) =>
        sentence.tokens.map((token, ti) => {
          const id = `${pi}.${si}.${ti}`
          if (token.kind === 'text') return { id, token }
          selections.set(id, {
            id,
            text: token.text,
            sentence: sentence.text,
            glossIndex: token.kind === 'gloss' ? token.index : undefined,
          })
          return { id, token }
        }),
      ),
    )
    return { rendered, selections }
  }, [text])

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const el = e.target instanceof Element ? e.target.closest('[data-token]') : null
    const id = el?.getAttribute('data-token')
    const selection = id ? paragraphs.selections.get(id) : undefined
    if (selection) onSelect(selection)
  }

  return (
    // The listener only delegates taps; keyboard access goes through the key-word buttons.
    <div className={styles.article} lang="en" onClick={handleClick}>
      {paragraphs.rendered.map((sentences, pi) => (
        <p key={pi}>
          {sentences.map((tokens, si) => [
            // Sentences were split on whitespace: put one space back between them.
            si > 0 ? ' ' : null,
            ...tokens.map(({ id, token }) => {
              if (token.kind === 'text') return <span key={id}>{token.text}</span>
              const selected = id === selectedId
              if (token.kind === 'gloss') {
                return (
                  <button
                    key={id}
                    type="button"
                    data-token={id}
                    aria-pressed={selected}
                    className={cx(styles.gloss, selected && styles.selected)}
                  >
                    {token.text}
                  </button>
                )
              }
              const known = findKnownWord(token.text, vocabulary) !== undefined
              return (
                <span
                  key={id}
                  data-token={id}
                  className={cx(styles.word, known && styles.known, selected && styles.selected)}
                >
                  {token.text}
                </span>
              )
            }),
          ])}
        </p>
      ))}
    </div>
  )
}

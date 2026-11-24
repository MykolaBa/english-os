import { useEffect, useState } from 'react'
import { ArrowLeft, Headphones, SearchX, Square } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Badge, Button, Card, EmptyState, Skeleton } from '@/components/ui'
import { getReadingText } from '@/content/reading'
import { useT } from '@/i18n'
import { isSpeechSupported, speak, stopSpeaking } from '@/lib/speech'
import { useCollections } from '@/features/vocabulary/hooks'
import { WordFormDialog } from '@/features/vocabulary/components/WordFormDialog'
import { ComprehensionPanel } from './components/ComprehensionPanel'
import { KeyWords } from './components/KeyWords'
import { ReadingArticle } from './components/ReadingArticle'
import { WordPanel } from './components/WordPanel'
import { useReadingProgress, useVocabularyIndex } from './hooks'
import { readingMinutes } from './readingTime'
import { draftFor, glossSentence, knownFor, type WordSelection } from './selection'
import styles from './Reading.module.scss'

/** Keyed by text id: opening another text starts with a clean selection and silence. */
export default function ReadingTextPage() {
  const { textId } = useParams()
  return <TextView key={textId} textId={textId} />
}

function TextView({ textId }: { textId: string | undefined }) {
  const text = textId ? getReadingText(textId) : undefined
  const progress = useReadingProgress(text?.id)
  const vocabulary = useVocabularyIndex()
  const collections = useCollections()
  const t = useT()
  const r = t.reading
  const [selection, setSelection] = useState<WordSelection | null>(null)
  const [adding, setAdding] = useState<WordSelection | null>(null)
  const [speaking, setSpeaking] = useState(false)

  // Leaving the page stops the narration (the browser would keep talking otherwise).
  useEffect(() => stopSpeaking, [])

  const back = (
    <Link to="/reading" className={styles.backLink}>
      <ArrowLeft aria-hidden /> {r.back}
    </Link>
  )

  if (!text) {
    return (
      <>
        {back}
        <Card padding="lg">
          <EmptyState icon={<SearchX />} title={r.notFoundTitle} description={r.notFoundText} />
        </Card>
      </>
    )
  }
  if (!vocabulary || progress === undefined) return <Skeleton height={480} />

  const toggleListen = () => {
    if (speaking) {
      stopSpeaking()
      return setSpeaking(false)
    }
    setSpeaking(true)
    speak(text.paragraphs.join(' '), 0.9, () => setSpeaking(false))
  }
  const gloss =
    selection?.glossIndex === undefined ? undefined : text.glossary[selection.glossIndex]

  return (
    <article className={styles.page}>
      {back}
      <header className={styles.hero}>
        <div className={styles.textMeta}>
          <Badge tone="accent">{text.level}</Badge>
          <span>{r.meta(r.topics[text.topic], readingMinutes(text))}</span>
        </div>
        <h1 className={styles.heroTitle} lang="en">
          {text.title}
        </h1>
        <p className={styles.heroSummary}>{text.summary}</p>
        {isSpeechSupported() && (
          <Button
            variant="secondary"
            size="sm"
            icon={speaking ? <Square /> : <Headphones />}
            onClick={toggleListen}
          >
            {speaking ? r.stop : r.listen}
          </Button>
        )}
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <Card padding="lg">
            <ReadingArticle
              text={text}
              vocabulary={vocabulary}
              selectedId={selection?.id ?? null}
              onSelect={setSelection}
            />
          </Card>
          <KeyWords
            glossary={text.glossary}
            vocabulary={vocabulary}
            onAdd={(i) => {
              const g = text.glossary[i]
              if (g) {
                setAdding({
                  id: `gloss.${i}`,
                  text: g.term,
                  sentence: glossSentence(text, i),
                  glossIndex: i,
                })
              }
            }}
          />
          <ComprehensionPanel text={text} progress={progress} />
        </div>
        <WordPanel
          headword={selection ? (gloss?.term ?? selection.text) : null}
          gloss={gloss}
          known={selection ? knownFor(text, selection, vocabulary) : undefined}
          onAdd={() => setAdding(selection)}
          onClose={() => setSelection(null)}
        />
      </div>

      {adding && collections && (
        <WordFormDialog
          key={adding.id}
          open
          onClose={() => setAdding(null)}
          collections={collections}
          initial={draftFor(text, adding)}
        />
      )}
    </article>
  )
}

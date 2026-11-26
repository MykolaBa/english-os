import { Lightbulb } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardHeader } from '@/components/ui'
import { useT } from '@/i18n'
import type { Word } from '@/lib/db/types'
import { LONG_SENTENCE, type TextAnalysis } from '../analysis'
import styles from '../Writing.module.scss'

/** Counted feedback: shape of the text, long sentences, repeats, vocabulary used. */
export function FeedbackPanel({ analysis, used }: { analysis: TextAnalysis; used: Word[] }) {
  const t = useT()
  const f = t.writing.feedback
  return (
    <Card>
      <CardHeader icon={<Lightbulb />} title={f.title} description={f.description} />
      {analysis.words === 0 ? (
        <p className={styles.muted}>{f.empty}</p>
      ) : (
        <>
          <dl className={styles.metrics}>
            <div>
              <dt>{f.sentences}</dt>
              <dd>{analysis.sentences}</dd>
            </div>
            <div>
              <dt>{f.avgSentence}</dt>
              <dd>{analysis.avgSentence}</dd>
            </div>
            <div>
              <dt>{f.variety}</dt>
              <dd>{analysis.variety}%</dd>
            </div>
          </dl>
          {analysis.longSentences.length > 0 && (
            <div className={styles.feedbackBlock}>
              <h3 className={styles.subTitle}>{f.longTitle}</h3>
              <p className={styles.muted}>{f.longText(LONG_SENTENCE)}</p>
              <ul className={styles.quotes}>
                {analysis.longSentences.map((s) => (
                  <li key={s} lang="en">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analysis.overused.length > 0 && (
            <div className={styles.feedbackBlock}>
              <h3 className={styles.subTitle}>{f.overusedTitle}</h3>
              <p className={styles.muted}>{f.overusedText}</p>
              <ul className={styles.chips}>
                {analysis.overused.map((o) => (
                  <li key={o.word}>
                    <span lang="en">{o.word}</span> <small>{f.times(o.count)}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={styles.feedbackBlock}>
            <h3 className={styles.subTitle}>{f.vocabularyTitle}</h3>
            <p className={styles.muted}>
              {used.length > 0 ? f.vocabularyText(used.length) : f.vocabularyNone}
            </p>
            {used.length > 0 && (
              <ul className={styles.chips}>
                {used.map((word) => (
                  <li key={word.id}>
                    <Link to={`/vocabulary/${encodeURIComponent(word.id)}`} lang="en">
                      {word.term}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Card>
  )
}

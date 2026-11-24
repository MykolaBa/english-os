import { BookOpen, CircleCheck, Mic } from 'lucide-react'
import { Link } from 'react-router'
import { ButtonLink, PageHeader, Skeleton } from '@/components/ui'
import { INTERVIEW_QUESTIONS, PHRASE_SETS } from '@/content/it'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { seedCollectionId } from '@/features/vocabulary/seed'
import { useInterviewAnswers } from './hooks'
import styles from './ItEnglish.module.scss'

export default function ItEnglishPage() {
  const s = useT().itEnglish
  const answers = useInterviewAnswers()

  return (
    <>
      <PageHeader title={s.title} description={s.subtitle} />
      <div className={styles.overview}>
        <section aria-labelledby="phrases-title">
          <h2 id="phrases-title" className={styles.sectionTitle}>
            {s.phrasesTitle}
          </h2>
          <p className={styles.muted}>{s.phrasesText}</p>
          <ul className={styles.list}>
            {PHRASE_SETS.map((set) => (
              <li key={set.id}>
                <Link to={`/it-english/phrases/${set.id}`} className={styles.row}>
                  <span className={styles.rowMain}>
                    <span className={styles.rowTitle} lang="en">
                      {set.title}
                    </span>
                    <span className={styles.rowText}>{set.summary}</span>
                  </span>
                  <span className={styles.rowMeta}>{s.phraseCount(set.phrases.length)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.techWords}>
            <BookOpen aria-hidden />
            <div>
              <h3 className={styles.tipTitle}>{s.techWords}</h3>
              <p className={styles.rowText}>{s.techWordsText}</p>
              <Link
                to={`/vocabulary?collection=${encodeURIComponent(seedCollectionId('it'))}`}
                className={styles.inlineLink}
              >
                {s.techWordsLink}
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="interview-title">
          <h2 id="interview-title" className={styles.sectionTitle}>
            {s.interviewTitle}
          </h2>
          <p className={styles.muted}>{s.interviewText}</p>
          <div className={styles.mockCta}>
            <div>
              <h3 className={styles.mockCtaTitle}>{s.mock.title}</h3>
              <p className={styles.rowText}>{s.mock.ctaText}</p>
            </div>
            <ButtonLink to="/it-english/mock" variant="primary" icon={<Mic />}>
              {s.mock.cta}
            </ButtonLink>
          </div>
          {answers && (
            <p className={styles.progressLine}>
              {s.progress(
                [...answers.values()].filter((a) => a.status === 'confident').length,
                [...answers.values()].filter((a) => a.answer.trim() !== '').length,
                INTERVIEW_QUESTIONS.length,
              )}
            </p>
          )}
          {!answers ? (
            <Skeleton height={320} />
          ) : (
            <ul className={styles.list}>
              {INTERVIEW_QUESTIONS.map((q) => {
                const status = answers.get(q.id)?.status
                return (
                  <li key={q.id}>
                    <Link to={`/it-english/interview/${q.id}`} className={styles.row}>
                      <span className={styles.rowMain}>
                        <span className={styles.rowTitle} lang="en">
                          {q.question}
                        </span>
                        <span className={styles.rowText}>{s.kinds[q.kind]}</span>
                      </span>
                      <span
                        className={cx(
                          styles.rowMeta,
                          status === 'confident' && styles.confidentMeta,
                        )}
                      >
                        {status === 'confident' && <CircleCheck aria-hidden />}
                        {s.status[status ?? 'none']}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import type { Example, GrammarLesson } from '@/content/grammar'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import styles from '../Grammar.module.scss'

function ExampleLine({ example }: { example: Example }) {
  const showTranslations = useSettings((s) => s.showTranslations)
  return (
    <li className={styles.example}>
      <p lang="en">{example.en}</p>
      {showTranslations && <p lang="uk">{example.uk}</p>}
    </li>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

/** The reading part of a lesson: explanation, forms, usage, mistakes, comparison. */
export function LessonSections({ lesson }: { lesson: GrammarLesson }) {
  const t = useT().grammar.lesson
  return (
    <>
      <Section title={t.explanation}>
        {lesson.explanation.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
        <figure className={styles.simpleEnglish}>
          <figcaption>{t.simpleEnglish}</figcaption>
          <blockquote lang="en">{lesson.simpleEnglish}</blockquote>
        </figure>
      </Section>

      <Section title={t.forms}>
        <div className={styles.forms}>
          {lesson.forms.map((form) => (
            <div key={form.label} className={styles.form}>
              <h3>{form.label}</h3>
              <p className={styles.formula} lang="en">
                {form.formula}
              </p>
              <ul className={styles.examples}>
                {form.examples.map((ex) => (
                  <ExampleLine key={ex.en} example={ex} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.usage}>
        <ul className={styles.usage}>
          {lesson.usage.map((u) => (
            <li key={u.title}>
              <h3>{u.title}</h3>
              <ul className={styles.examples}>
                <ExampleLine example={u.example} />
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.mistakes}>
        <ul className={styles.mistakes}>
          {lesson.mistakes.map((m) => (
            <li key={m.wrong}>
              <p className={styles.wrong} lang="en">
                <X aria-label={t.wrong} />
                <s>{m.wrong}</s>
              </p>
              <p className={styles.right} lang="en">
                <Check aria-label={t.right} />
                {m.right}
              </p>
              <p className={styles.why}>{m.why}</p>
            </li>
          ))}
        </ul>
      </Section>

      {lesson.comparison && (
        <Section title={lesson.comparison.title}>
          <p className={styles.paragraph}>{lesson.comparison.text}</p>
          <ul className={styles.examples}>
            {lesson.comparison.examples.map((ex) => (
              <ExampleLine key={ex.en} example={ex} />
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

import { ChevronRight, Circle, CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { useT, type Dictionary } from '@/i18n'
import { cx } from '@/lib/cx'
import type { AgendaItem, AgendaKind } from '../agenda'
import styles from '../Planner.module.scss'

/** Nav labels double as area names, so the planner speaks the same words as the menu. */
const NAV_ID = {
  review: 'review',
  grammar: 'grammar',
  reading: 'reading',
  listening: 'listening',
  speaking: 'speaking',
  writing: 'writing',
  it: 'itEnglish',
} as const satisfies Record<AgendaKind, keyof Dictionary['nav']['items']>

/** Today's steps, each a link with its time and a done mark. */
export function AgendaList({ items }: { items: AgendaItem[] }) {
  const t = useT()
  const p = t.planner
  return (
    <ul className={styles.agenda}>
      {items.map((item) => (
        <li key={item.kind}>
          <Link to={item.to} className={cx(styles.agendaItem, item.done && styles.agendaDone)}>
            {item.done ? (
              <CircleCheck className={styles.check} aria-label={t.common.done} />
            ) : (
              <Circle className={styles.circle} aria-label={t.common.toDo} />
            )}
            <span className={styles.agendaText}>
              <span className={styles.area}>{t.nav.items[NAV_ID[item.kind]].label}</span>
              <span className={styles.agendaTitle} lang={item.title ? 'en' : undefined}>
                {item.title ?? (item.kind === 'review' ? p.reviewTitle : p.chooseNext)}
              </span>
            </span>
            <span className={styles.minutes}>{p.minutes(item.minutes)}</span>
            <ChevronRight className={styles.chevron} aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  )
}

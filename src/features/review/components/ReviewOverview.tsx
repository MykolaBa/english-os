import { useMemo, useState } from 'react'
import { CalendarClock, Play, Plus, Sparkles } from 'lucide-react'
import { Button, ButtonLink, Card, CardHeader, EmptyState, Segmented } from '@/components/ui'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { formatDue, weekdayShort } from '@/lib/date'
import type { Word } from '@/lib/db/types'
import { useSettings, type ReviewMode } from '@/stores/settingsStore'
import { useCollections } from '@/features/vocabulary/hooks'
import type { ReviewData } from '../hooks'
import { buildQueue, estimateMinutes, forecast, isDue } from '../queue'
import { countIntroduced } from '../reviewRepo'
import styles from '../Review.module.scss'

interface ReviewOverviewProps {
  data: ReviewData
  onStart: (queue: Word[], mode: ReviewMode) => void
}

export function ReviewOverview({ data, onStart }: ReviewOverviewProps) {
  const t = useT()
  const o = t.review.overview
  const newPerDay = useSettings((s) => s.newWordsPerDay)
  const mode = useSettings((s) => s.reviewMode)
  const update = useSettings((s) => s.update)
  const collections = useCollections()
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [extraNew, setExtraNew] = useState(0)
  // Captured once per visit; the overview doesn't need to tick.
  const [now] = useState(() => Date.now())

  const introduced = countIntroduced(data.todayLogs)
  const newLeft = Math.max(0, newPerDay - introduced)
  const queue = useMemo(
    () => buildQueue(data.words, { now, newLimit: newLeft + extraNew, collectionId }),
    [data.words, now, newLeft, extraNew, collectionId],
  )

  const due = queue.filter((w) => w.srs.status !== 'new').length
  const fresh = queue.length - due
  const overdue = data.words.filter((w) => isDue(w, now) && w.srs.dueAt < now - 86_400_000).length
  const answeredToday = data.todayLogs.length
  const correctToday = data.todayLogs.filter((l) => l.rating !== 'again').length
  const accuracy = answeredToday ? Math.round((correctToday / answeredToday) * 100) : null
  const days = forecast(data.words, now)
  const maxDay = Math.max(1, ...days.map((d) => d.count))
  const nextDue = data.words
    .filter((w) => w.srs.status !== 'new' && w.srs.dueAt > now)
    .reduce<number | null>(
      (min, w) => (min === null || w.srs.dueAt < min ? w.srs.dueAt : min),
      null,
    )

  if (data.words.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={<Sparkles />}
          title={o.noWordsTitle}
          description={o.noWordsText}
          action={
            <ButtonLink to="/vocabulary?add=1" variant="primary" icon={<Plus />}>
              {o.addWords}
            </ButtonLink>
          }
        />
      </Card>
    )
  }

  return (
    <div className={styles.overview}>
      <section className={styles.startPanel}>
        {queue.length > 0 ? (
          <>
            <h2 className={styles.startHeadline}>{o.headline(due, fresh)}</h2>
            <p className={styles.startMeta}>{o.estimate(estimateMinutes(due, fresh))}</p>
          </>
        ) : (
          <>
            <h2 className={styles.startHeadline}>{o.doneTitle}</h2>
            <p className={styles.startMeta}>
              {o.doneText(
                nextDue === null ? null : formatDue(nextDue, t.locale, t.common.justNow, now),
              )}
            </p>
          </>
        )}

        <div className={styles.startOptions}>
          <Segmented<ReviewMode>
            label={o.mode}
            value={mode}
            onChange={(reviewMode) => update({ reviewMode })}
            options={[
              { value: 'flashcards', label: o.modes.flashcards },
              { value: 'reverse', label: o.modes.reverse },
              { value: 'typing', label: o.modes.typing },
            ]}
          />
          <label className={styles.collectionPick}>
            <span>{o.collection}</span>
            <select
              value={collectionId ?? ''}
              onChange={(e) => setCollectionId(e.target.value || null)}
            >
              <option value="">{o.allWords}</option>
              {collections?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.startActions}>
          {queue.length > 0 ? (
            <Button
              variant="primary"
              size="lg"
              icon={<Play />}
              onClick={() => onStart(queue, mode)}
            >
              {o.start}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={<Plus />}
              onClick={() => setExtraNew((n) => n + 5)}
            >
              {o.learnMore}
            </Button>
          )}
        </div>
      </section>

      <dl className={styles.stats}>
        <div>
          <dt>{o.stats.due}</dt>
          <dd>{data.words.filter((w) => isDue(w, now)).length}</dd>
        </div>
        <div>
          <dt>{o.stats.overdue}</dt>
          <dd>{overdue}</dd>
        </div>
        <div>
          <dt>{o.stats.newToday}</dt>
          <dd>
            {introduced}
            <small>{o.stats.newLeft(newLeft, newPerDay)}</small>
          </dd>
        </div>
        <div>
          <dt>{o.stats.reviewed}</dt>
          <dd>
            {answeredToday}
            <small>{o.stats.accuracy(accuracy)}</small>
          </dd>
        </div>
      </dl>

      <Card>
        <CardHeader
          icon={<CalendarClock />}
          title={o.forecastTitle}
          description={o.forecastDescription}
        />
        <ol className={styles.forecast}>
          {days.map((d, i) => (
            <li key={d.day}>
              <span className={cx(styles.forecastDay, i === 0 && styles.forecastToday)}>
                {i === 0 ? o.today : weekdayShort(d.day, t.locale)}
              </span>
              <span className={styles.forecastTrack} aria-hidden>
                <span style={{ width: `${(d.count / maxDay) * 100}%` }} />
              </span>
              <span className={styles.forecastCount}>{d.count}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

import { useT } from '@/i18n'
import type { ReviewRating } from '@/lib/db/types'
import { REVIEW_RATINGS, type previewIntervals } from '@/lib/srs/scheduler'
import { cx } from '@/lib/cx'
import styles from '../Review.module.scss'

interface RatingBarProps {
  /** When each answer would bring the word back; `null` in practice, where nothing moves. */
  preview: ReturnType<typeof previewIntervals> | null
  disabled?: boolean
  onRate: (rating: ReviewRating) => void
}

/** Four answers; each shows when the word will come back. Keys 1–4 work too. */
export function RatingBar({ preview, disabled, onRate }: RatingBarProps) {
  const t = useT().review.session
  return (
    <div className={styles.ratings} role="group" aria-label={t.rate}>
      {REVIEW_RATINGS.map((rating, i) => {
        const p = preview?.[rating]
        const when = !p ? null : 'minutes' in p ? t.minutes(p.minutes) : t.days(p.days)
        return (
          <button
            key={rating}
            type="button"
            className={cx(styles.rating, styles[rating])}
            disabled={disabled}
            onClick={() => onRate(rating)}
          >
            <span className={styles.ratingLabel}>{t.ratings[rating]}</span>
            {when && <span className={styles.ratingWhen}>{when}</span>}
            <kbd className={styles.key} aria-hidden>
              {i + 1}
            </kbd>
          </button>
        )
      })}
    </div>
  )
}

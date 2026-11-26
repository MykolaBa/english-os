import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { SELF_RATINGS, type SelfRating } from '@/lib/db/types'
import styles from '../Speaking.module.scss'

/** The learner's own verdict on a take: not yet / almost / sounds right. */
export function RatingButtons({
  value,
  onChange,
}: {
  value?: SelfRating
  onChange: (rating: SelfRating) => void
}) {
  const s = useT().speaking
  return (
    <div className={styles.ratings} role="group" aria-label={s.rateLabel}>
      {SELF_RATINGS.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={value === r}
          className={cx(styles.rating, styles[`rating-${r}`], value === r && styles.ratingOn)}
          onClick={() => onChange(r)}
        >
          {s.ratings[r]}
        </button>
      ))}
    </div>
  )
}

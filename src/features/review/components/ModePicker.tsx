import { useId } from 'react'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { REVIEW_MODES, type ReviewMode } from '@/stores/settingsStore'
import styles from '../Review.module.scss'

/**
 * Review mode as a list of real radio buttons, each saying what the session will ask
 * of you. (Three bare labels didn't explain the difference.)
 */
export function ModePicker({
  value,
  onChange,
}: {
  value: ReviewMode
  onChange: (mode: ReviewMode) => void
}) {
  const o = useT().review.overview
  const name = useId()
  return (
    <fieldset className={styles.modes}>
      <legend>{o.mode}</legend>
      {REVIEW_MODES.map((mode) => (
        <label key={mode} className={cx(styles.mode, mode === value && styles.modeOn)}>
          <input
            type="radio"
            name={name}
            value={mode}
            checked={mode === value}
            onChange={() => onChange(mode)}
            className={styles.modeInput}
          />
          <span className={styles.modeDot} aria-hidden />
          <span className={styles.modeText}>
            <span className={styles.modeTitle}>{o.modes[mode].title}</span>
            <span className={styles.modeHint}>{o.modes[mode].hint}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}

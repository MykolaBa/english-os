import { Repeat, Target } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardHeader, SelectField } from '@/components/ui'
import { useT } from '@/i18n'
import { useSettings } from '@/stores/settingsStore'
import { GOALS, INTERVAL_FIELDS, NEW_PER_DAY, RATING_OF, withCurrent } from '../options'
import styles from '../Settings.module.scss'

export function GoalSection() {
  const s = useT().settings
  const dailyXpGoal = useSettings((st) => st.dailyXpGoal)
  const update = useSettings((st) => st.update)
  return (
    <Card>
      <CardHeader icon={<Target />} title={s.goalTitle} description={s.goalDescription} />
      <SelectField
        label={s.goalLabel}
        hint={s.goalHint}
        options={withCurrent(GOALS, dailyXpGoal).map((xp) => ({
          value: String(xp),
          label: s.goalOption(xp),
        }))}
        value={String(dailyXpGoal)}
        onChange={(v) => update({ dailyXpGoal: Number(v) })}
      />
    </Card>
  )
}

export function ReviewSection() {
  const t = useT()
  const s = t.settings
  const { newWordsPerDay, srs, update } = useSettings(
    useShallow((st) => ({ newWordsPerDay: st.newWordsPerDay, srs: st.srs, update: st.update })),
  )
  return (
    <Card>
      <CardHeader icon={<Repeat />} title={s.reviewTitle} description={s.reviewDescription} />
      <div className={styles.fields}>
        <SelectField
          label={s.newPerDay}
          hint={s.newPerDayHint}
          options={withCurrent(NEW_PER_DAY, newWordsPerDay).map((n) => ({
            value: String(n),
            label: String(n),
          }))}
          value={String(newWordsPerDay)}
          onChange={(v) => update({ newWordsPerDay: Number(v) })}
        />
        <fieldset className={styles.fieldset}>
          <legend>{s.intervals}</legend>
          <div className={styles.row4}>
            {INTERVAL_FIELDS.map(({ key, options, unit }) => (
              <SelectField
                key={key}
                label={t.review.session.ratings[RATING_OF[key]]}
                options={withCurrent(options, srs[key]).map((n) => ({
                  value: String(n),
                  label: unit === 'min' ? s.minutesOption(n) : s.daysOption(n),
                }))}
                value={String(srs[key])}
                onChange={(v) => update({ srs: { ...srs, [key]: Number(v) } })}
              />
            ))}
          </div>
          <p className={styles.hint}>{s.intervalsHint}</p>
        </fieldset>
      </div>
    </Card>
  )
}

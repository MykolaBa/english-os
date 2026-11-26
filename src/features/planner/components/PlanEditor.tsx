import { useShallow } from 'zustand/react/shallow'
import { Card, CardHeader, Chip, Segmented } from '@/components/ui'
import { useT } from '@/i18n'
import { PLAN_AREAS, PLAN_MINUTES, WEEKDAYS, type PlanArea, type Weekday } from '@/lib/plan'
import { useSettings } from '@/stores/settingsStore'
import styles from '../Planner.module.scss'

const AREA_NAV = {
  grammar: 'grammar',
  reading: 'reading',
  listening: 'listening',
  speaking: 'speaking',
  writing: 'writing',
  it: 'itEnglish',
} as const

/** A Monday in some past week: just to name weekdays in the current language. */
const weekdayName = (day: Weekday, locale: string) =>
  new Date(2024, 0, 7 + day).toLocaleDateString(locale, { weekday: 'short' })

const toggle = <T,>(list: readonly T[], value: T) =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value]

/** Days, minutes and skills. Saved as you change them (settings). */
export function PlanEditor() {
  const t = useT()
  const p = t.planner
  const { days, minutes, focus, update } = useSettings(
    useShallow((s) => ({
      days: s.studyDays,
      minutes: s.studyMinutes,
      focus: s.studyFocus,
      update: s.update,
    })),
  )
  return (
    <Card>
      <CardHeader title={p.planTitle} description={p.planText} />
      <div className={styles.editor}>
        <fieldset className={styles.fieldset}>
          <legend>{p.days}</legend>
          <div className={styles.chips}>
            {WEEKDAYS.map((d) => (
              <Chip
                key={d}
                selected={days.includes(d)}
                onClick={() => update({ studyDays: toggle(days, d) })}
              >
                {weekdayName(d, t.locale)}
              </Chip>
            ))}
          </div>
        </fieldset>
        <Segmented<`${number}`>
          label={p.minutesLabel}
          value={`${minutes}`}
          options={PLAN_MINUTES.map((m) => ({ value: `${m}`, label: `${m}` }))}
          onChange={(v) =>
            update({ studyMinutes: PLAN_MINUTES.find((m) => `${m}` === v) ?? minutes })
          }
        />
        <fieldset className={styles.fieldset}>
          <legend>{p.focus}</legend>
          <div className={styles.chips}>
            {PLAN_AREAS.map((area: PlanArea) => (
              <Chip
                key={area}
                selected={focus.includes(area)}
                onClick={() =>
                  update({ studyFocus: PLAN_AREAS.filter((a) => toggle(focus, area).includes(a)) })
                }
              >
                {t.nav.items[AREA_NAV[area]].label}
              </Chip>
            ))}
          </div>
          <p className={styles.hint}>{p.focusHint}</p>
        </fieldset>
      </div>
    </Card>
  )
}

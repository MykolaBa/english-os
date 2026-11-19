import { useEffect, useState } from 'react'
import { Database, Info, Monitor, Moon, Palette, Repeat, Sun, Target, User } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  PageHeader,
  Segmented,
  SelectField,
  Switch,
  TextField,
} from '@/components/ui'
import { useT } from '@/i18n'
import { CEFR_LEVELS, type ReviewRating } from '@/lib/db/types'
import type { SrsConfig } from '@/lib/srs/scheduler'
import {
  formatBytes,
  getStorageInfo,
  requestPersistentStorage,
  type StorageInfo,
} from '@/lib/storage/persistence'
import { useSettings, type ThemePreference, type UiLanguage } from '@/stores/settingsStore'
import { toast } from '@/stores/toastStore'
import styles from './Settings.module.scss'

const LEVEL_OPTIONS = CEFR_LEVELS.map((l) => ({ value: l, label: l }))
const GOALS = [20, 30, 50, 80, 120]
const NEW_PER_DAY = [0, 5, 10, 15, 20, 30]

const INTERVAL_FIELDS = [
  { key: 'againMinutes', options: [1, 5, 10, 30], unit: 'min' },
  { key: 'hardDays', options: [1, 2], unit: 'day' },
  { key: 'goodDays', options: [2, 3, 4, 5], unit: 'day' },
  { key: 'easyDays', options: [5, 7, 10, 14], unit: 'day' },
] as const satisfies ReadonlyArray<{
  key: keyof SrsConfig
  options: readonly number[]
  unit: 'min' | 'day'
}>

const RATING_OF = {
  againMinutes: 'again',
  hardDays: 'hard',
  goodDays: 'good',
  easyDays: 'easy',
} as const satisfies Record<keyof SrsConfig, ReviewRating>

export default function SettingsPage() {
  const settings = useSettings()
  const t = useT()
  const s = t.settings
  const [storage, setStorage] = useState<StorageInfo | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    void getStorageInfo().then(setStorage)
  }, [])

  const askPersistence = async () => {
    const granted = await requestPersistentStorage()
    setStorage(await getStorageInfo())
    if (granted) toast.success(s.protectedToast)
    else toast.info(s.declinedToast, s.declinedText)
  }

  return (
    <>
      <PageHeader title={s.title} description={s.subtitle} />

      <div className={styles.grid}>
        <Card>
          <CardHeader icon={<Palette />} title={s.appearance} />
          <div className={styles.fields}>
            <Segmented<UiLanguage>
              label={s.language}
              value={settings.uiLanguage}
              onChange={(uiLanguage) => settings.update({ uiLanguage })}
              options={[
                { value: 'en', label: 'English' },
                { value: 'uk', label: 'Українська' },
              ]}
            />
            <p className={styles.hint}>{s.languageHint}</p>
            <Segmented<ThemePreference>
              label={s.theme}
              value={settings.theme}
              onChange={(theme) => settings.update({ theme })}
              options={[
                { value: 'dark', label: s.themeDark, icon: <Moon /> },
                { value: 'light', label: s.themeLight, icon: <Sun /> },
                { value: 'system', label: s.themeSystem, icon: <Monitor /> },
              ]}
            />
            <Switch
              label={s.showTranslations}
              description={s.showTranslationsHint}
              checked={settings.showTranslations}
              onChange={(showTranslations) => settings.update({ showTranslations })}
            />
            <Switch
              label={s.autoPronounce}
              description={s.autoPronounceHint}
              checked={settings.autoPronounce}
              onChange={(autoPronounce) => settings.update({ autoPronounce })}
            />
          </div>
        </Card>

        <Card>
          <CardHeader icon={<User />} title={s.profile} />
          <div className={styles.fields}>
            <TextField
              label={s.name}
              placeholder={s.namePlaceholder}
              value={settings.displayName}
              maxLength={40}
              onChange={(e) => settings.update({ displayName: e.target.value })}
            />
            <div className={styles.row}>
              <SelectField
                label={s.currentLevel}
                options={LEVEL_OPTIONS}
                value={settings.currentLevel}
                onChange={(v) =>
                  settings.update({
                    currentLevel: v,
                  })
                }
              />
              <SelectField
                label={s.targetLevel}
                options={LEVEL_OPTIONS}
                value={settings.targetLevel}
                onChange={(v) =>
                  settings.update({
                    targetLevel: v,
                  })
                }
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Target />} title={s.goalTitle} description={s.goalDescription} />
          <SelectField
            label={s.goalLabel}
            hint={s.goalHint}
            options={GOALS.map((xp) => ({ value: String(xp), label: s.goalOption(xp) }))}
            value={String(settings.dailyXpGoal)}
            onChange={(v) => settings.update({ dailyXpGoal: Number(v) })}
          />
        </Card>

        <Card>
          <CardHeader icon={<Repeat />} title={s.reviewTitle} description={s.reviewDescription} />
          <div className={styles.fields}>
            <SelectField
              label={s.newPerDay}
              hint={s.newPerDayHint}
              options={NEW_PER_DAY.map((n) => ({ value: String(n), label: String(n) }))}
              value={String(settings.newWordsPerDay)}
              onChange={(v) => settings.update({ newWordsPerDay: Number(v) })}
            />
            <fieldset className={styles.fieldset}>
              <legend>{s.intervals}</legend>
              <div className={styles.row4}>
                {INTERVAL_FIELDS.map(({ key, options, unit }) => (
                  <SelectField
                    key={key}
                    label={t.review.session.ratings[RATING_OF[key]]}
                    options={options.map((n) => ({
                      value: String(n),
                      label: unit === 'min' ? s.minutesOption(n) : s.daysOption(n),
                    }))}
                    value={String(settings.srs[key])}
                    onChange={(v) =>
                      settings.update({ srs: { ...settings.srs, [key]: Number(v) } })
                    }
                  />
                ))}
              </div>
              <p className={styles.hint}>{s.intervalsHint}</p>
            </fieldset>
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Database />} title={s.data} description={s.dataDescription} />
          <dl className={styles.facts}>
            <div>
              <dt>{s.persistent}</dt>
              <dd>
                {storage?.persisted ? (
                  <Badge tone="success">{s.protected}</Badge>
                ) : (
                  <Button size="sm" onClick={askPersistence}>
                    {s.protect}
                  </Button>
                )}
              </dd>
            </div>
            <div>
              <dt>{s.used}</dt>
              <dd>{storage?.usageBytes !== undefined ? formatBytes(storage.usageBytes) : '—'}</dd>
            </div>
          </dl>
          <p className={styles.note}>{s.backupSoon}</p>
        </Card>

        <Card>
          <CardHeader icon={<Info />} title={s.about} />
          <dl className={styles.facts}>
            <div>
              <dt>{s.version}</dt>
              <dd>{__APP_VERSION__}</dd>
            </div>
            <div>
              <dt>{s.mode}</dt>
              <dd>{s.modeValue}</dd>
            </div>
          </dl>
          <div className={styles.resetRow}>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
              {s.reset}
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title={s.resetTitle}
        description={s.resetText}
        confirmLabel={s.resetConfirm}
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          settings.reset()
          setConfirmReset(false)
          toast.success(t.settings.resetDone)
        }}
      />
    </>
  )
}

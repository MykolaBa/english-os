import { useEffect, useState } from 'react'
import { Database, Info, Monitor, Moon, Palette, Sun, Target, User } from 'lucide-react'
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
import { CEFR_LEVELS, type CefrLevel } from '@/lib/db/types'
import {
  formatBytes,
  getStorageInfo,
  requestPersistentStorage,
  type StorageInfo,
} from '@/lib/storage/persistence'
import { useSettings, type ThemePreference } from '@/stores/settingsStore'
import { toast } from '@/stores/toastStore'
import styles from './Settings.module.scss'

const LEVEL_OPTIONS = CEFR_LEVELS.map((l) => ({ value: l, label: l }))
const GOAL_OPTIONS = [20, 30, 50, 80, 120].map((xp) => ({
  value: String(xp),
  label: `${xp} XP${xp === 20 ? ' · light' : xp === 50 ? ' · regular' : xp === 120 ? ' · intense' : ''}`,
}))

export default function SettingsPage() {
  const settings = useSettings()
  const [storage, setStorage] = useState<StorageInfo | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    void getStorageInfo().then(setStorage)
  }, [])

  const askPersistence = async () => {
    const granted = await requestPersistentStorage()
    setStorage(await getStorageInfo())
    if (granted) toast.success('Persistent storage enabled')
    else
      toast.info(
        'Browser declined',
        'Install the app or use it more often — browsers grant this to trusted sites.',
      )
  }

  return (
    <>
      <PageHeader title="Settings" description="Preferences are stored on this device." />

      <div className={styles.grid}>
        <Card>
          <CardHeader icon={<User />} title="Profile" />
          <div className={styles.fields}>
            <TextField
              label="Your name"
              placeholder="How should we greet you?"
              value={settings.displayName}
              maxLength={40}
              onChange={(e) => settings.update({ displayName: e.target.value })}
            />
            <div className={styles.row}>
              <SelectField
                label="Current level"
                options={LEVEL_OPTIONS}
                value={settings.currentLevel}
                onChange={(e) => settings.update({ currentLevel: e.target.value as CefrLevel })}
              />
              <SelectField
                label="Target level"
                options={LEVEL_OPTIONS}
                value={settings.targetLevel}
                onChange={(e) => settings.update({ targetLevel: e.target.value as CefrLevel })}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={<Target />}
            title="Daily goal"
            description="A goal you can keep on a busy day works best."
          />
          <div className={styles.fields}>
            <SelectField
              label="Daily XP goal"
              hint="≈1 XP per reviewed card; lessons and quizzes give more."
              options={GOAL_OPTIONS}
              value={String(settings.dailyXpGoal)}
              onChange={(e) => settings.update({ dailyXpGoal: Number(e.target.value) })}
            />
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Palette />} title="Appearance & learning" />
          <div className={styles.fields}>
            <Segmented<ThemePreference>
              label="Theme"
              value={settings.theme}
              onChange={(theme) => settings.update({ theme })}
              options={[
                { value: 'dark', label: 'Dark', icon: <Moon /> },
                { value: 'light', label: 'Light', icon: <Sun /> },
                { value: 'system', label: 'System', icon: <Monitor /> },
              ]}
            />
            <Switch
              label="Show Ukrainian translations"
              description="Translations and explanations in learning content."
              checked={settings.showTranslations}
              onChange={(showTranslations) => settings.update({ showTranslations })}
            />
            <Switch
              label="Pronounce words automatically"
              description="Uses your device’s built-in voice on flashcards."
              checked={settings.autoPronounce}
              onChange={(autoPronounce) => settings.update({ autoPronounce })}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={<Database />}
            title="Data & storage"
            description="All learning data stays in this browser."
          />
          <dl className={styles.facts}>
            <div>
              <dt>Persistent storage</dt>
              <dd>
                {storage?.persisted ? (
                  <Badge tone="success">Protected</Badge>
                ) : (
                  <Button size="sm" onClick={askPersistence}>
                    Protect my data
                  </Button>
                )}
              </dd>
            </div>
            <div>
              <dt>Used</dt>
              <dd>{storage?.usageBytes !== undefined ? formatBytes(storage.usageBytes) : '—'}</dd>
            </div>
          </dl>
          <p className={styles.note}>Backup, restore and CSV import/export arrive in phase 4.</p>
        </Card>

        <Card>
          <CardHeader icon={<Info />} title="About" />
          <dl className={styles.facts}>
            <div>
              <dt>Version</dt>
              <dd>{__APP_VERSION__}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>Local-first · no account · no tracking</dd>
            </div>
          </dl>
          <div className={styles.resetRow}>
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
              Reset preferences
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset preferences?"
        description="Name, level, goal and theme return to defaults. Your words and progress are not affected."
        confirmLabel="Reset"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          settings.reset()
          setConfirmReset(false)
          toast.success('Preferences reset')
        }}
      />
    </>
  )
}

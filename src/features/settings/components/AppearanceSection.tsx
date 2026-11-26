import { Monitor, Moon, Palette, Sun } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Card, CardHeader, Segmented, Switch } from '@/components/ui'
import { useT } from '@/i18n'
import { useSettings, type ThemePreference, type UiLanguage } from '@/stores/settingsStore'
import styles from '../Settings.module.scss'

export function AppearanceSection() {
  const s = useT().settings
  const { uiLanguage, theme, showTranslations, autoPronounce, update } = useSettings(
    useShallow((st) => ({
      uiLanguage: st.uiLanguage,
      theme: st.theme,
      showTranslations: st.showTranslations,
      autoPronounce: st.autoPronounce,
      update: st.update,
    })),
  )
  return (
    <Card>
      <CardHeader icon={<Palette />} title={s.appearance} />
      <div className={styles.fields}>
        <Segmented<UiLanguage>
          label={s.language}
          value={uiLanguage}
          onChange={(value) => update({ uiLanguage: value })}
          options={[
            // Each language is named in itself, so it's findable whatever the UI language.
            { value: 'en', label: 'English' },
            { value: 'uk', label: 'Українська' },
          ]}
        />
        <p className={styles.hint}>{s.languageHint}</p>
        <Segmented<ThemePreference>
          label={s.theme}
          value={theme}
          onChange={(value) => update({ theme: value })}
          options={[
            { value: 'dark', label: s.themeDark, icon: <Moon /> },
            { value: 'light', label: s.themeLight, icon: <Sun /> },
            { value: 'system', label: s.themeSystem, icon: <Monitor /> },
          ]}
        />
        <Switch
          label={s.showTranslations}
          description={s.showTranslationsHint}
          checked={showTranslations}
          onChange={(value) => update({ showTranslations: value })}
        />
        <Switch
          label={s.autoPronounce}
          description={s.autoPronounceHint}
          checked={autoPronounce}
          onChange={(value) => update({ autoPronounce: value })}
        />
      </div>
    </Card>
  )
}

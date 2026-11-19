import { useSettings, type UiLanguage } from '@/stores/settingsStore'
import { en, type Dictionary } from './en'
import { uk } from './uk'

export type { Dictionary, UiLanguage }

const DICTIONARIES: Record<UiLanguage, Dictionary> = { en, uk }

/**
 * Current UI dictionary. Usage: `const t = useT()` → `t.vocabulary.title`,
 * `t.vocabulary.subtitle(12)`. Re-renders automatically when the language changes.
 */
export function useT(): Dictionary {
  const language = useSettings((s) => s.uiLanguage)
  return DICTIONARIES[language]
}

/** For code outside React components (repo functions, toasts in services). */
export function getT(): Dictionary {
  return DICTIONARIES[useSettings.getState().uiLanguage]
}

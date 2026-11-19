import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CefrLevel } from '@/lib/db/types'

export type ThemePreference = 'dark' | 'light' | 'system'

export interface Settings {
  displayName: string
  currentLevel: CefrLevel
  targetLevel: CefrLevel
  /** Daily XP goal. ~1 XP per reviewed card, more for lessons/quizzes. */
  dailyXpGoal: number
  theme: ThemePreference
  showTranslations: boolean
  /** Speak words aloud automatically on flashcards (Web Speech API). */
  autoPronounce: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  displayName: '',
  currentLevel: 'A2',
  targetLevel: 'B2',
  dailyXpGoal: 50,
  theme: 'dark',
  showTranslations: true,
  autoPronounce: false,
}

interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

/** Lightweight preferences → localStorage. Learning data goes to IndexedDB. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => set(patch),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    { name: 'englishos:settings', version: 1 },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CefrLevel } from '@/lib/db/types'
import { DEFAULT_SRS_CONFIG, type SrsConfig } from '@/lib/srs/scheduler'

export type ThemePreference = 'dark' | 'light' | 'system'
export type UiLanguage = 'en' | 'uk'
export const REVIEW_MODES = ['flashcards', 'reverse', 'typing'] as const
export type ReviewMode = (typeof REVIEW_MODES)[number]

export interface Settings {
  displayName: string
  currentLevel: CefrLevel
  targetLevel: CefrLevel
  /** Daily XP goal. ~1 XP per reviewed card, more for lessons/quizzes. */
  dailyXpGoal: number
  theme: ThemePreference
  /** Interface language. Learning content stays English regardless. */
  uiLanguage: UiLanguage
  showTranslations: boolean
  /** Speak words aloud automatically on flashcards (Web Speech API). */
  autoPronounce: boolean
  /** How many brand-new words a review session may introduce per day. */
  newWordsPerDay: number
  /** First intervals of the spaced-repetition scheduler. */
  srs: SrsConfig
  /** flashcards = English → Ukrainian, reverse = Ukrainian → English, typing = type the word. */
  reviewMode: ReviewMode
}

export const DEFAULT_SETTINGS: Settings = {
  displayName: '',
  currentLevel: 'A2',
  targetLevel: 'B2',
  dailyXpGoal: 50,
  theme: 'dark',
  uiLanguage: 'en',
  showTranslations: true,
  autoPronounce: false,
  newWordsPerDay: 10,
  srs: DEFAULT_SRS_CONFIG,
  reviewMode: 'flashcards',
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

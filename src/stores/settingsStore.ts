import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CEFR_LEVELS, type CefrLevel } from '@/lib/db/types'
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

/** Field-by-field schema for settings coming from outside (a backup file). */
const settingsFields = {
  displayName: z.string().max(40),
  currentLevel: z.enum(CEFR_LEVELS),
  targetLevel: z.enum(CEFR_LEVELS),
  dailyXpGoal: z.number().int().min(1).max(1000),
  theme: z.enum(['dark', 'light', 'system']),
  uiLanguage: z.enum(['en', 'uk']),
  showTranslations: z.boolean(),
  autoPronounce: z.boolean(),
  newWordsPerDay: z.number().int().min(0).max(200),
  srs: z.object({
    againMinutes: z.number().positive().max(1440),
    hardDays: z.number().positive().max(365),
    goodDays: z.number().positive().max(365),
    easyDays: z.number().positive().max(365),
  }),
  reviewMode: z.enum(REVIEW_MODES),
} satisfies { [K in keyof Settings]: z.ZodType<Settings[K]> }

/** Keeps only valid known fields — one bad value doesn't discard the rest. */
export function sanitizeSettings(raw: unknown): Partial<Settings> {
  if (typeof raw !== 'object' || raw === null) return {}
  const result: Record<string, unknown> = {}
  for (const [key, schema] of Object.entries(settingsFields)) {
    const parsed = schema.safeParse((raw as Record<string, unknown>)[key])
    if (parsed.success) result[key] = parsed.data
  }
  return result as Partial<Settings>
}

/** The persisted settings, without the store's actions. */
export function currentSettings(): Settings {
  const { update: _update, reset: _reset, ...settings } = useSettings.getState()
  return settings
}

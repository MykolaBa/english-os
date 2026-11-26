import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CEFR_LEVELS, type CefrLevel } from '@/lib/db/types'
import { isOneOf, isRecord } from '@/lib/guards'
import { PLAN_AREAS, PLAN_MINUTES, WEEKDAYS, type PlanArea, type Weekday } from '@/lib/plan'
import { DEFAULT_SRS_CONFIG, type SrsConfig } from '@/lib/srs/scheduler'

export const THEMES = ['dark', 'light', 'system'] as const
export type ThemePreference = (typeof THEMES)[number]
export const UI_LANGUAGES = ['en', 'uk'] as const
export type UiLanguage = (typeof UI_LANGUAGES)[number]
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
  /** Study plan: the days you study, minutes per day, and the skills to rotate through. */
  studyDays: Weekday[]
  studyMinutes: number
  studyFocus: PlanArea[]
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
  studyDays: [1, 2, 3, 4, 5],
  studyMinutes: 20,
  studyFocus: [...PLAN_AREAS],
}

interface SettingsState extends Settings {
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

/**
 * Field-by-field validation for settings from outside the app's control: localStorage
 * (may be stale or edited by hand) and backup files. Plain guards instead of zod keep
 * the schema library out of the startup bundle.
 */
const isText =
  (max: number) =>
  (v: unknown): v is string =>
    typeof v === 'string' && v.length <= max
const isInt =
  (min: number, max: number) =>
  (v: unknown): v is number =>
    Number.isInteger(v) && typeof v === 'number' && v >= min && v <= max
const isPositive =
  (max: number) =>
  (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= max
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'
/** An array of known values without repeats (order doesn't matter). */
const isSetOf = <T>(options: readonly T[], v: unknown): v is T[] =>
  Array.isArray(v) && new Set(v).size === v.length && v.every((x) => isOneOf(options, x))

const isSrsConfig = (v: unknown): v is SrsConfig =>
  isRecord(v) &&
  isPositive(1440)(v.againMinutes) &&
  isPositive(365)(v.hardDays) &&
  isPositive(365)(v.goodDays) &&
  isPositive(365)(v.easyDays)

const SETTINGS_GUARDS: { [K in keyof Settings]: (v: unknown) => v is Settings[K] } = {
  displayName: isText(40),
  currentLevel: (v) => isOneOf(CEFR_LEVELS, v),
  targetLevel: (v) => isOneOf(CEFR_LEVELS, v),
  dailyXpGoal: isInt(1, 1000),
  theme: (v) => isOneOf(THEMES, v),
  uiLanguage: (v) => isOneOf(UI_LANGUAGES, v),
  showTranslations: isBool,
  autoPronounce: isBool,
  newWordsPerDay: isInt(0, 200),
  srs: isSrsConfig,
  reviewMode: (v) => isOneOf(REVIEW_MODES, v),
  studyDays: (v): v is Weekday[] => isSetOf(WEEKDAYS, v),
  studyMinutes: (v): v is number => isOneOf(PLAN_MINUTES, v),
  studyFocus: (v): v is PlanArea[] => isSetOf(PLAN_AREAS, v),
}

const SETTING_KEYS = Object.keys(SETTINGS_GUARDS).filter(
  (k): k is keyof Settings => k in SETTINGS_GUARDS,
)

/** Keeps only valid known fields — one bad value doesn't discard the rest. */
export function sanitizeSettings(raw: unknown): Partial<Settings> {
  if (!isRecord(raw)) return {}
  const out: Partial<Settings> = {}
  const take = <K extends keyof Settings>(key: K) => {
    const value = raw[key]
    if (SETTINGS_GUARDS[key](value)) out[key] = value
  }
  SETTING_KEYS.forEach(take)
  return out
}

/** Lightweight preferences → localStorage. Learning data goes to IndexedDB. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => set(patch),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'englishos:settings',
      version: 1,
      // Stored values are untrusted: only valid fields override the defaults.
      merge: (persisted, current) => ({ ...current, ...sanitizeSettings(persisted) }),
      migrate: (persisted) => sanitizeSettings(persisted),
    },
  ),
)

/** The persisted settings, without the store's actions. */
export function currentSettings(): Settings {
  const { update: _update, reset: _reset, ...settings } = useSettings.getState()
  return settings
}

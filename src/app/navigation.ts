import {
  BookOpen,
  BookOpenText,
  BrainCircuit,
  CalendarCheck,
  ChartNoAxesColumn,
  CircleHelp,
  Code,
  Headphones,
  LayoutDashboard,
  Library,
  Mic,
  PenLine,
  Repeat,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { Dictionary } from '@/i18n'

export type NavItemId = keyof Dictionary['nav']['items']
export type NavGroupId = keyof Dictionary['nav']['groups']

export interface NavItem {
  /** Key into `t.nav.items` — label and summary come from the i18n dictionary. */
  id: NavItemId
  path: string
  icon: LucideIcon
  /** Roadmap phase in which the module gets implemented (see docs/ROADMAP.md). */
  phase: number
  /** Shown in the mobile bottom bar. Keep it to 4 items. */
  mobilePrimary?: boolean
}

export interface NavGroup {
  id: NavGroupId
  items: NavItem[]
}

/** Single source of truth for sidebar, mobile nav and routes. */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    items: [
      { id: 'dashboard', path: '/', icon: LayoutDashboard, phase: 1, mobilePrimary: true },
      { id: 'planner', path: '/planner', icon: CalendarCheck, phase: 9 },
      { id: 'statistics', path: '/statistics', icon: ChartNoAxesColumn, phase: 6 },
    ],
  },
  {
    id: 'learn',
    items: [
      { id: 'vocabulary', path: '/vocabulary', icon: BookOpen, phase: 2, mobilePrimary: true },
      { id: 'review', path: '/review', icon: Repeat, phase: 3, mobilePrimary: true },
      { id: 'grammar', path: '/grammar', icon: BrainCircuit, phase: 5, mobilePrimary: true },
      { id: 'quizzes', path: '/quizzes', icon: CircleHelp, phase: 6 },
    ],
  },
  {
    id: 'skills',
    items: [
      { id: 'reading', path: '/reading', icon: BookOpenText, phase: 7 },
      { id: 'listening', path: '/listening', icon: Headphones, phase: 8 },
      { id: 'speaking', path: '/speaking', icon: Mic, phase: 8 },
      { id: 'writing', path: '/writing', icon: PenLine, phase: 8 },
    ],
  },
  {
    id: 'career',
    items: [{ id: 'itEnglish', path: '/it-english', icon: Code, phase: 7 }],
  },
  {
    id: 'personal',
    items: [
      { id: 'library', path: '/library', icon: Library, phase: 9 },
      { id: 'settings', path: '/settings', icon: Settings, phase: 1 },
    ],
  },
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

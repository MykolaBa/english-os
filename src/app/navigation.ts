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

export interface NavItem {
  path: string
  label: string
  icon: LucideIcon
  /** One-line purpose, used on placeholder pages and tooltips. */
  summary: string
  /** Roadmap phase in which the module gets implemented (see docs/ROADMAP.md). */
  phase: number
  /** Shown in the mobile bottom bar. Keep it to 4 items. */
  mobilePrimary?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Single source of truth for sidebar, mobile nav and routes. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        path: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        summary: 'Your daily learning overview.',
        phase: 1,
        mobilePrimary: true,
      },
      {
        path: '/planner',
        label: 'Study Planner',
        icon: CalendarCheck,
        summary: 'Plan daily tasks and weekly goals.',
        phase: 9,
      },
      {
        path: '/statistics',
        label: 'Statistics',
        icon: ChartNoAxesColumn,
        summary: 'Progress, retention and activity over time.',
        phase: 6,
      },
    ],
  },
  {
    label: 'Learn',
    items: [
      {
        path: '/vocabulary',
        label: 'Vocabulary',
        icon: BookOpen,
        summary: 'Your personal dictionary and collections.',
        phase: 2,
        mobilePrimary: true,
      },
      {
        path: '/review',
        label: 'Review',
        icon: Repeat,
        summary: 'Spaced-repetition flashcards for due words.',
        phase: 3,
        mobilePrimary: true,
      },
      {
        path: '/grammar',
        label: 'Grammar',
        icon: BrainCircuit,
        summary: 'Structured lessons from A2 to B2 with exercises.',
        phase: 5,
        mobilePrimary: true,
      },
      {
        path: '/quizzes',
        label: 'Quizzes',
        icon: CircleHelp,
        summary: 'Mixed vocabulary and grammar quizzes.',
        phase: 6,
      },
    ],
  },
  {
    label: 'Skills',
    items: [
      {
        path: '/reading',
        label: 'Reading',
        icon: BookOpenText,
        summary: 'Graded texts — tap a word to save it.',
        phase: 7,
      },
      {
        path: '/listening',
        label: 'Listening',
        icon: Headphones,
        summary: 'Audio with transcripts and questions.',
        phase: 8,
      },
      {
        path: '/speaking',
        label: 'Speaking',
        icon: Mic,
        summary: 'Prompts, scenarios and self-recording.',
        phase: 8,
      },
      {
        path: '/writing',
        label: 'Writing',
        icon: PenLine,
        summary: 'Journal, emails and essays with drafts.',
        phase: 8,
      },
    ],
  },
  {
    label: 'Career',
    items: [
      {
        path: '/it-english',
        label: 'IT English',
        icon: Code,
        summary: 'Tech vocabulary, questions and interview prep.',
        phase: 7,
      },
    ],
  },
  {
    label: 'Personal',
    items: [
      {
        path: '/library',
        label: 'Library',
        icon: Library,
        summary: 'Your notes, links and learning materials.',
        phase: 9,
      },
      {
        path: '/settings',
        label: 'Settings',
        icon: Settings,
        summary: 'Preferences, goals and data backup.',
        phase: 1,
      },
    ],
  },
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

export function findNavItem(path: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.path === path)
}

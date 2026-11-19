# Architecture

## Folder structure

```
src/
  app/                 App shell: router, layout, navigation config, theme sync
    layout/            AppLayout, SidebarNav, BottomNav, Logo
    navigation.ts      Single source of truth for all sections
    router.tsx         Routes; implemented pages registered in PAGES
  components/ui/       Reusable design-system components (import from '@/components/ui')
  features/<module>/   One folder per module: Page, components/, hooks, repo, pure logic + tests
  lib/
    db/                Dexie database (db.ts) and persisted entity types (types.ts)
    activity/          Activity log repository + streak logic
    storage/           Persistent-storage helpers
    date.ts, id.ts, cx.ts
  stores/              Zustand stores: settings (localStorage), toasts
  i18n/                UI dictionaries (en.ts, uk.ts) + useT()
  content/             Static learning content as typed modules (starter vocabulary, …)
  styles/              _tokens.scss, _mixins.scss, global.scss
```

## Data flow

```
 UI component ──useLiveQuery──▶ repo function ──▶ Dexie (IndexedDB)
      │                                              ▲
      └── user action ──▶ repo write + logActivity() ┘
                                     │
          Dashboard / Statistics ◀───┘  (derived from the activity table)
```

- **IndexedDB (Dexie)**: words, collections, review logs, activity events, meta.
- **localStorage (Zustand persist)**: lightweight settings only.
- **Code (`src/content`)**: grammar lessons, texts, prompts — versioned with git, never
  duplicated on startup, and fixable by editing a file.

## Interface language
`useT()` returns the dictionary for the current `uiLanguage` setting. `uk.ts` is typed as
`Dictionary` (the shape of `en.ts`), so a missing or misspelled key fails the build. Strings
with parameters are functions, which also handles plural rules per language.

## Starter content
`src/content/vocabulary/starterWords.ts` is imported by `seedStarterVocabulary()` on every
start. It runs in one transaction, checks a content version in the `meta` table, and records
every seed id ever inserted — so it never duplicates, never overwrites edits and never
re-adds words the user deleted. To ship more words: append entries and bump the version.

## Why these choices
- **Dexie over raw IndexedDB**: typed tables, indexes, schema versioning/migrations, and
  `useLiveQuery`, which re-renders components when data changes — so no global store has
  to mirror the database.
- **Activity log**: one append-only table makes streaks, XP, daily goals and charts simple
  derived queries instead of counters scattered across modules.
- **SCSS modules + CSS variables**: scoped class names per component, themes by swapping
  variables, no runtime CSS-in-JS cost.
- **Native `<dialog>`**: focus trap, Esc and backdrop semantics without a UI library.
- **PWA**: installable on the phone home screen and works offline.

## Future: sync and AI
Repo functions are the only code touching Dexie. A backend can later be added behind the
same functions (sync queue on top of `updatedAt`). AI features will be a service module that
calls a small server-side proxy; API keys never live in the frontend.

## Known limitations
- Data lives per device/browser. Until sync exists, move data via backup files (phase 4).
- Browsers may evict storage; `navigator.storage.persist()` is requested and backups are the
  real safety net.

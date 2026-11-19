# EnglishOS — instructions for Claude

Personal, local-first English-learning web app (A2 → B2+), focused on everyday,
professional and IT/frontend English. Single user, used daily on desktop **and phone** (PWA).

The owner is learning React/TypeScript while building this. Act as developer **and mentor**:
build in small, working increments; for each feature briefly explain what/why/which files/
key concepts/how to test. Don't dump huge explanations. Chat with the owner in Ukrainian.

## Stack
React 19 · TypeScript (strict) · Vite · SCSS modules · React Router (`react-router`) ·
Dexie (IndexedDB) + `dexie-react-hooks` · Zustand · zod · lucide-react · vite-plugin-pwa ·
Vitest + Testing Library + fake-indexeddb. Recharts will be added with Statistics (phase 6).
No backend, no paid APIs, no API keys. Ask before adding any dependency.

## Commands
- `npm run dev` — dev server
- `npm run check` — typecheck + lint (oxlint) + tests. **Run before every commit.**
- `npm run build` — production build (also typechecks)
- `npm run format` — Prettier

## Architecture rules
- **Feature folders**: `src/features/<module>/` own their pages, components, hooks and repo
  functions. Shared UI in `src/components/ui` (import from `@/components/ui`). Cross-cutting
  logic in `src/lib`. Use the `@/` alias.
- **Data**: only *user data* goes to IndexedDB (`src/lib/db`). Static learning content
  (grammar, reading, IT questions) lives in `src/content` as typed TS modules referenced by id.
  Seeded vocabulary is imported into the DB once, with stable `seed:*` ids and `source: 'seed'`.
- **Schema changes**: never edit a released `db.version(n)`; add `version(n + 1)` + upgrade.
- **Reads in components** via `useLiveQuery` (auto-refresh). Zustand only for UI/session state
  and settings (`localStorage`, key `englishos:settings`) — never a second copy of DB data.
- **Activity log**: every meaningful learning action calls `logActivity()` (with XP). Dashboard,
  streak and statistics are *derived* from the `activity` table — no per-module counters.
- **Pure logic** (SRS scheduling, streaks, plans, quiz scoring) lives in plain functions with
  unit tests next to them (`*.test.ts`).
- **Navigation**: `src/app/navigation.ts` is the single source for sidebar, mobile nav and
  routes (labels come from `t.nav.items[id]`). Implemented pages are registered in `PAGES` in `src/app/router.tsx`; others show the
  roadmap placeholder. Pages are lazy-loaded default exports.

## Languages (i18n)
- The interface is bilingual: English (default) and Ukrainian, switched in Settings
  (`uiLanguage`). **Never hardcode UI text in components** — add it to `src/i18n/en.ts`
  and `src/i18n/uk.ts` (same shape, enforced by the `Dictionary` type) and read it via
  `const t = useT()`. Outside components use `getT()`.
- Parameterized strings are functions (`t.vocabulary.subtitle(n)`); Ukrainian plurals use
  the 3-form `plural()` helper in `uk.ts`. Dates/numbers: pass `t.locale` to Intl/helpers.
- Learning content (words, examples, lessons) stays English with Ukrainian translations,
  regardless of the interface language. Mark it with `lang="en"` / `lang="uk"`.
- Don't store translated sentences in the DB (e.g. activity events store `type` + `subject`;
  the UI builds the sentence).

## Design system
- Tokens are CSS variables in `src/styles/_tokens.scss` (dark default, light, system). Never
  hardcode colors/radii/spacing in components — use tokens. Mixins in `_mixins.scss`
  (`up(md)`, `focus-ring`, `card-surface`, `truncate`).
- Look: calm premium dashboard (Linear/Notion-like), violet/blue/teal accents used sparingly,
  subtle motion, no clutter, no childish gamification.
- Mobile-first: test at ~390px. Bottom nav (`mobilePrimary` items) + drawer on < 1024px.
  Inputs use 16px font on mobile (prevents iOS zoom). Respect safe-area insets.
- Accessibility: semantic elements, labels, `aria-*` on custom controls, visible focus,
  keyboard support, `prefers-reduced-motion`.
- SVG `id`s must be unique per instance (`useId`) — components render in several places.

## Conventions
- Components ≤ ~150 lines; split widgets into `components/`. Named exports except lazy pages.
- Dialogs: mark the first field with `data-autofocus` (not `autoFocus`).
- Empty, loading and error states for every data view. Confirm destructive actions
  (`ConfirmDialog`), report results with `toast`.
- Ukrainian translations must be accurate; prefer fewer, high-quality content items.
- `src/content` is excluded from Prettier: keep content compact (one entry per line).
- AI features: only when explicitly requested, behind a service interface, never with keys
  in the frontend.

## Status
See `docs/ROADMAP.md` — update it when a phase/feature is completed.

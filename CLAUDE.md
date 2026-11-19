# EnglishOS — instructions for Claude

Personal, local-first English-learning web app (A2 → B2+), focused on everyday,
professional and IT/frontend English. Single user, used daily on desktop **and phone** (PWA).

The owner is learning React/TypeScript while building this. Act as developer **and mentor**:
build in small, working increments; for each feature briefly explain what/why/which files/
key concepts/how to test. Don't dump huge explanations. Interface text is English; learning
explanations and translations are Ukrainian. Chat with the owner in Ukrainian.

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
  routes. Implemented pages are registered in `PAGES` in `src/app/router.tsx`; others show the
  roadmap placeholder. Pages are lazy-loaded default exports.

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
- Empty, loading and error states for every data view. Confirm destructive actions
  (`ConfirmDialog`), report results with `toast`.
- Ukrainian translations must be accurate; prefer fewer, high-quality content items.
- AI features: only when explicitly requested, behind a service interface, never with keys
  in the frontend.

## Status
See `docs/ROADMAP.md` — update it when a phase/feature is completed.

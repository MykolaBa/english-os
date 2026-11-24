# EnglishOS — instructions for Claude

Personal, local-first English-learning web app (A2 → B2+), focused on everyday,
professional and IT/frontend English. Single user, used daily on desktop **and phone** (PWA).

The owner is learning React/TypeScript while building this. Act as developer **and mentor**:
build in small, working increments; for each feature briefly explain what/why/which files/
key concepts/how to test. Don't dump huge explanations. Chat with the owner in Ukrainian.

## Stack
React 19 · TypeScript (strict) · Vite · SCSS modules · React Router (`react-router`) ·
Dexie (IndexedDB) + `dexie-react-hooks` · Zustand · zod · lucide-react · vite-plugin-pwa ·
Vitest + Testing Library + fake-indexeddb · Recharts (Statistics page only, lazy-loaded).
No backend, no paid APIs, no API keys. Ask before adding any dependency.

## Commands
- `npm run dev` — dev server
- `npm run check` — typecheck + lint (oxlint) + tests. **Run before every commit.**
- **After every step (feature/phase)**: run a code review of the changes (`/code-review`), fix
  the findings, then commit. The owner asked for this review loop on every step.
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
  Current: v5 (v1 + `lessonProgress` v2 + `quizResults` v3 + `readingProgress` v4 +
  `interviewAnswers` v5). New tables also go into the backup schema (with a
  `.default([])` so older backups still restore).
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
- Concept: **a personal dictionary**. The most characteristic object is the dictionary entry
  (headword, IPA, part of speech in italics, sense, example). Screens open with real content
  (e.g. the dashboard opens with the next word to learn), not with stat widgets.
- Type roles: **Onest** (`--font-sans`, full Cyrillic) is the interface voice; **Literata**
  (`--font-serif`) is the English language itself — headwords, IPA, definitions, examples.
  Never set IPA in monospace.
- Palette: Ink `#131628` background (not tinted black), Paper `#ECEAF6` text, Violet
  `#9B8CFF` primary, Teal `#43D6C3` success/mastered, Blue `#6C9BFF` new/info.
  `--gradient-brand` is for the logo only — no decorative gradient washes.
- Spend boldness in one place per screen; keep the rest quiet. Avoid generic tells:
  ALL-CAPS labels/eyebrows, `A · B · C` meta strings (write a sentence), `→` in buttons,
  rows of identical cards (prefer one surface with dividers, or a list), entrance animations
  on every page (one orchestrated moment at most; motion that answers user actions is fine).
- Copy: sentence case, active verbs, the action keeps its name through the flow.
- Mobile-first: test at ~390px. Bottom nav (`mobilePrimary` items) + drawer on < 1024px.
  Inputs use 16px font on mobile (prevents iOS zoom). Respect safe-area insets.
- Accessibility: semantic elements, labels, `aria-*` on custom controls, visible focus,
  keyboard support, `prefers-reduced-motion`.
- SVG `id`s must be unique per instance (`useId`) — components render in several places.

## Conventions
- Components ≤ ~150 lines; split widgets into `components/`. Named exports except lazy pages.
- Dialogs: mark the first field with `data-autofocus` (not `autoFocus`).
- Never use a native `<select>` (its open list is drawn by the OS): use `Select` /
  `SelectField` from the UI kit (`variant="pill"` for toolbar filters). For a few options that
  need explaining, prefer a radio list with a one-line hint per option (see `ModePicker`).
- Empty, loading and error states for every data view. Confirm destructive actions
  (`ConfirmDialog`), report results with `toast`.
- Ukrainian translations must be accurate; prefer fewer, high-quality content items.
- `src/content` is excluded from Prettier: keep content compact (one entry per line).
- Grammar lessons: one file per lesson in `src/content/grammar/lessons/`, listed in
  `content/grammar/index.ts`. Lesson and exercise ids are stable (saved progress uses them).
  `grammar.test.ts` must pass: every accepted answer checks as correct.
- Reading texts: one file per text in `src/content/reading/texts/`, listed in
  `content/reading/index.ts`; text and question ids are stable. `reading.test.ts` must pass:
  every glossary `form` (or `term`) really appears in its text.
- IT English content: `src/content/it/phrases.ts` (phrase sets) and `interview.ts`
  (questions); ids are stable (saved answers use them). `it.test.ts` and `drill.test.ts`
  must pass: phrases are unique and every phrase can be turned into a gap exercise.
- Exercises: use the shared engine (`lib/exercises`, `features/exercises/ExerciseRunner`) for
  any practice or quiz — don't build a second one.
- AI features: only when explicitly requested, behind a service interface, never with keys
  in the frontend.

## Project skills (`.claude/skills/`)
- `vercel-react-best-practices` — performance rules. This is a client-only Vite SPA: skip
  the `server-*` and Next.js-specific rules (`next/dynamic`, RSC, `after()`); lazy routes are
  `React.lazy` in `router.tsx`. Applied so far: app init in `main.tsx` (not an effect),
  `toSorted()`, narrow store selectors (`useShallow`), `content-visibility` on long lists,
  `useDeferredValue` for search.
- `vercel-composition-patterns` — prefer composition/explicit variants over boolean props
  that change behavior; React 19: no `forwardRef` (ref is a prop), `use()` over `useContext`.
- `typescript-advanced-types` — no `as` casts on untrusted values (URL params, `<select>`,
  DB `meta`): use the guards in `src/lib/guards.ts` (`parseOneOf`, `isOneOf`). Option lists
  are `as const satisfies readonly T[]` so they double as runtime lists and literal types.
- Zustand: select only what a component uses (`useSettings((s) => s.x)` or `useShallow`);
  keep actions in the store; persisted state is versioned (`version` in `persist`).

## Status
See `docs/ROADMAP.md` — update it when a phase/feature is completed.

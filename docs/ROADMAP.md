# Roadmap

MVP = phases 0–4: after phase 4 EnglishOS is usable every day on desktop and phone.

| Phase | Scope | Status |
|---|---|---|
| 0 | Project setup: Vite, strict TS, lint, Prettier, Vitest, PWA, git, CLAUDE.md | ✅ Done |
| 1 | Foundation: design tokens, themes, layout (sidebar / bottom nav / drawer), UI kit, DB schema, activity log, dashboard on live data, settings | ✅ Done |
| 2 | Vocabulary: CRUD, search/filter/sort, collections, favorites, word detail page, ~100 seeded words, pronunciation (speechSynthesis) + Ukrainian interface | ✅ Done |
| 3 | Review: SRS algorithm (SM-2-lite, tested), flashcard session (Again/Hard/Good/Easy), typing mode, review logs, XP | ⏳ Next |
| 4 | Dashboard polish, JSON backup/restore, CSV/JSON vocabulary import/export (zod-validated), deploy as PWA | |
| 5 | Grammar lessons A2/B1 (content as code) + shared exercise engine | |
| 6 | Quizzes (custom, mistakes tracking) + Statistics (Recharts) | |
| 7 | Reading (tap word → add to vocabulary) + IT English (terms, questions, interview prep) | |
| 8 | Writing (drafts, versions), Speaking (MediaRecorder), Listening (player + transcript) | |
| 9 | Study planner, personal library, subtle gamification (achievements) | |
| 10 | Optional AI features behind a backend proxy | |

## Done in phase 2
- Interface language switch (English / Українська) with typed dictionaries, Ukrainian
  plurals and localized dates — no i18n library
- 105 starter words in 8 collections (+ empty "Difficult Words" and "My Mistakes"),
  imported once with stable `seed:*` ids; deleted starter words never come back
- Vocabulary page: search, status/level/favorites filters, 6 sort orders — all kept in the
  URL; collection chips with counts; create/delete own collections
- Add/edit word dialog (zod validation, duplicate detection), word cards with pronunciation
  and favorites, word detail page with learning progress, delete with confirmation
- New words are not counted as "due" — they will be introduced by the review session

## Done in phase 1
- Dark / light / system theme with no flash on load
- Responsive shell: desktop sidebar, mobile top bar, bottom tab bar, slide-in menu
- UI kit: Button/ButtonLink, Card, Badge, ProgressBar/Ring, EmptyState, PageHeader,
  Dialog/ConfirmDialog (native `<dialog>`), Toaster, Spinner/Skeleton, ErrorBoundary,
  TextField/SelectField/Switch/Segmented
- IndexedDB schema v1: words, collections, reviewLogs, activity, meta
- Activity log + streak calculation (tested)
- Dashboard: daily XP goal ring, streak, due count, words, study days, weekly chart,
  today's plan, recent activity, level journey, quick actions — all from live data
- Settings: name, levels, daily goal, theme, translations, auto-pronounce, storage protection
- PWA manifest + icons + offline service worker

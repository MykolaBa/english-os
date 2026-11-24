# Roadmap

MVP = phases 0–4: after phase 4 EnglishOS is usable every day on desktop and phone.

| Phase | Scope | Status |
|---|---|---|
| 0 | Project setup: Vite, strict TS, lint, Prettier, Vitest, PWA, git, CLAUDE.md | ✅ Done |
| 1 | Foundation: design tokens, themes, layout (sidebar / bottom nav / drawer), UI kit, DB schema, activity log, dashboard on live data, settings | ✅ Done |
| 2 | Vocabulary: CRUD, search/filter/sort, collections, favorites, word detail page, ~100 seeded words, pronunciation (speechSynthesis) + Ukrainian interface | ✅ Done |
| 3 | Review: SRS algorithm (SM-2-lite, tested), flashcard session (Again/Hard/Good/Easy), typing mode, review logs, XP | ✅ Done |
| 4 | Dashboard polish, JSON backup/restore, CSV/JSON vocabulary import/export (zod-validated), deploy as PWA | ✅ Done — live at https://english-os-henna.vercel.app |
| 5 | Grammar lessons A2/B1 (content as code) + shared exercise engine | ⏳ Next |
| 6 | Quizzes (custom, mistakes tracking) + Statistics (Recharts) | |
| 7 | Reading (tap word → add to vocabulary) + IT English (terms, questions, interview prep) | |
| 8 | Writing (drafts, versions), Speaking (MediaRecorder), Listening (player + transcript) | |
| 9 | Study planner, personal library, subtle gamification (achievements) | |
| 10 | Optional AI features behind a backend proxy | |

## Done in phase 4
- Backup: one JSON file with all tables and settings; every row validated by zod schemas
  (`lib/db/schemas.ts`, kept in sync with the types via `satisfies`) before anything is written;
  restore is a single transaction and offers to download the current data first
- Settings from a backup are applied field by field, so one bad value doesn't drop the rest
- Vocabulary import from CSV (header in English or Ukrainian, `,` `;` or tab, BOM, quotes) or
  JSON; a preview shows new words, skipped duplicates, rows with problems (by line) and new
  collections before anything is saved; imported words earn no XP
- Vocabulary export to CSV (opens in Excel with Cyrillic and IPA intact) or JSON, all words or
  the current filtered view
- Backup reminder in today's plan when there is progress and no backup for 14+ days

## Done in phase 3
- `lib/srs/scheduler.ts`: simplified SM-2 — configurable first intervals (10 min / 1 / 3 / 7 d),
  then growth by per-word ease; lapses, mastered at 21+ days; due at the start of the day
- Review overview: today's queue in one sentence with time estimate, mode (EN→UA, UA→EN,
  typing), collection filter, stats strip, 7-day forecast, "learn 5 more" when done
- Queue: often-forgotten due words first, then new words within the daily limit
- Session (pure reducer): flashcards with a turn animation, typing mode with typo tolerance
  and a masked example as hint, "again" cards return in the same session, keys Space / 1–4
- Each answer is one transaction: SRS state, review log, XP; forgotten words join "My Mistakes"
- Summary: cards, accuracy, XP, time and words worth another look
- Settings: new words per day and the four first intervals; dashboard feed groups reviews
- Practice: repeat learned words any time (weakest first, recently reviewed or random; 10 / 20 /
  50 / all) — earns XP and tracks mistakes, never changes review dates; primary action when
  caught up

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

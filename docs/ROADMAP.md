# Roadmap

MVP = phases 0–4: after phase 4 EnglishOS is usable every day on desktop and phone.

| Phase | Scope | Status |
|---|---|---|
| 0 | Project setup: Vite, strict TS, lint, Prettier, Vitest, PWA, git, CLAUDE.md | ✅ Done |
| 1 | Foundation: design tokens, themes, layout (sidebar / bottom nav / drawer), UI kit, DB schema, activity log, dashboard on live data, settings | ✅ Done |
| 2 | Vocabulary: CRUD, search/filter/sort, collections, favorites, word detail page, ~100 seeded words, pronunciation (speechSynthesis) + Ukrainian interface | ✅ Done |
| 3 | Review: SRS algorithm (SM-2-lite, tested), flashcard session (Again/Hard/Good/Easy), typing mode, review logs, XP | ✅ Done |
| 4 | Dashboard polish, JSON backup/restore, CSV/JSON vocabulary import/export (zod-validated), deploy as PWA | ✅ Done — live at https://english-os-henna.vercel.app |
| 5 | Grammar lessons A2/B1 (content as code) + shared exercise engine | ✅ Done (6 lessons; more to add) |
| 6 | Quizzes (custom, mistakes tracking) + Statistics (Recharts) | ✅ Done |
| 7 | Reading (tap word → add to vocabulary) + IT English (terms, questions, interview prep) | ✅ Done |
| 8 | Writing (drafts, versions), Speaking (MediaRecorder), Listening (player + transcript) | ✅ Done |
| 9 | Study planner, personal library, subtle gamification (achievements) | ⏳ Next |
| 10 | Optional AI features behind a backend proxy | |

## Done in phase 9 (part 2: personal library)
- Save your own texts and links (database v9 `library`, in backups): paste text or import a
  .txt (its heading becomes the title), add a link (http/https only — checked when saving,
  restoring a backup and rendering), tags, notes and a status (to read, reading, done)
- Read them in the same reader as graded texts: tap any word, see it in your vocabulary or
  add it with the sentence as the example
- "How hard is it for you?": the share of content words you already know (your vocabulary
  plus a list of very common words) and the new words worth learning, forms grouped
- Search and filters by status and tag; first "done" gives XP once

## Done in phase 9 (part 1: study planner)
- A plan in Settings-backed preferences: study days, minutes a day, skills to rotate
  (validated like every setting, included in backups)
- Today's agenda, derived from the plan and the app's state (`features/planner`): review
  first when words are due, then skills in a daily rotation within your minutes — the next
  lesson, unread text, episode, a speaking set that isn't right yet, your unfinished draft,
  an interview question you're not confident with; items tick off from today's activity
- Day off with "study anyway", and this week's planned days against days studied
- The dashboard's "Today's plan" is now the same agenda (lazy-loaded, so learning content
  stays off the startup path); the old static plan remains only for an empty vocabulary

## Done in phase 8 (part 3: listening)
- Five episodes (`src/content/listening`, A2–B2): ordering a coffee, booking a doctor, a
  stand-up, an onboarding call, a short talk on caching — transcript with translations
- A script player on the browser's speech synthesis: line by line with the current line
  highlighted, two different voices for a dialogue (or a higher pitch when the device has
  one), three speeds, pause/resume that works on Android too, tap a line to play from it
- Listen first: the transcript is hidden until you open it; translations are a switch
- Check: dictation (hear the line, type the missing word — exercises now support `audio`)
  and comprehension questions on the shared engine; progress in database v8, XP once per
  first completion plus one per correct answer

## Done in phase 8 (part 2: speaking)
- Shadowing (`src/content/speaking`): four sets of five sentences — the th sounds, word
  stress in tech words, question intonation, linking — with notes on what to listen for;
  listen at normal or slow speed, record yourself, play back and rate the take
- Speaking tasks (A2–B2, 60–90 s): situation, plan, phrases, a countdown that starts with
  the recording, and your saved takes to listen back to
- `useRecorder` on MediaRecorder: picks a format the browser records (WebM or MP4/Safari),
  stops by itself at 2 minutes, shows a live loudness meter, releases the microphone as
  soon as it stops (also when you leave mid-permission or mid-recording)
- Recordings in database v7 (`recordings`), newest 3 per sentence/task; audio stays on
  the device and is not in JSON backups (said in Speaking and in Settings); XP is saved
  with the take in one transaction
- No speech recognition on purpose: in Chrome it sends audio to a server

## Done in phase 8 (part 1: writing)
- Six writing tasks as content (`src/content/writing`, A2–B2: introduce yourself, weekend
  plans, move a meeting, stand-up update, bug report, pull request), each with phrases to
  insert at the cursor, a checklist and a model answer; a blank page for free writing
- Editor with autosave (debounced, flushed before any action and when leaving), live word
  count against the task's range, versions (capped, restorable — restoring keeps the current
  text as a version) and a word-level diff against any version
- Feedback without AI (`features/writing/analysis.ts`): sentences, words per sentence,
  word variety, long sentences, repeated words, and which of your vocabulary words you used
- Database v6 (`writings`, in backups); "Mark as done" saves a version and gives XP once,
  in one transaction; untouched drafts are removed when you leave them

## Done in phase 7 (part 2: IT English)
- Phrasebook for a developer's day (`src/content/it/phrases.ts`): stand-up, asking for help,
  code review, estimates, meetings, bug reports — 35 phrases with Ukrainian equivalents and
  usage notes; pronounce or save any phrase to the vocabulary
- Phrase practice on the shared engine, mixing two skills: pick the phrase for its meaning
  and type its key word (seeded generator, `features/itEnglish/drill.ts`)
- Interview practice: 8 common questions (about you and technical) with what the
  interviewer wants to hear, an outline, a model answer and useful phrases; write and keep
  your own answer and mark it confident (database v5, `interviewAnswers`, in backups)
- Mock interview: random questions read aloud, two minutes each with a timer and hints,
  then a summary linking to each question to write the answer down
- Progress on the overview and a link to the IT & Programming words

## Done in phase 7 (part 1: reading)
- Six graded texts as code (`src/content/reading`, A2–B2: everyday, work, IT), each with a
  glossary of key words and comprehension questions; `reading.test.ts` checks every key word
  really appears in its text
- Tap any word: a dictionary-style panel (sticky column on desktop, sheet on the phone) with
  pronunciation, translation for key words, and "Add to vocabulary" prefilled with the
  sentence as the example; words you already know are marked in the text
- Comprehension questions on the shared `ExerciseRunner`; reading progress in database v4
  (`readingProgress`, included in backups), XP and the activity feed
- Listen to the whole text with the browser's speech synthesis

## Done in phase 6 (part 2: statistics)
- Statistics page with a 7 days / 30 days / 3 months period (3 months is grouped by week);
  everything is derived from `activity`, `reviewLogs`, `quizResults` and `lessonProgress` by
  pure, tested functions (`features/statistics/stats.ts`) — no stored counters
- Period summary, XP per day/week (bar chart) and review accuracy (line chart with gaps for
  days off) built with Recharts (lazy chunk, only loaded on this page); hover and keyboard
  tooltips, and every chart can be shown as a table
- Where your XP comes from, vocabulary by learning stage, and "needs attention": the words you
  forget most and grammar lessons below the pass mark, each linking to the fix

## Done in phase 6 (part 1: quizzes)
- Seeded quiz generator (`features/quizzes/generate.ts`): vocabulary questions built from your
  words (meaning, word for a translation, typing, word in context; distractors of the same part
  of speech) plus grammar exercises from lessons; learned words first
- Quick quizzes (mixed, words, grammar, my mistakes) and a custom quiz builder with a live
  "N questions ready" preview; all run on the shared `ExerciseRunner`
- Quiz history (database v3, `quizResults`) with exact "repeat" from stored question ids
- Mistakes stay in sync: missed words join My Mistakes, missed grammar joins the lesson's
  mistakes; a correct answer in the "My mistakes" quiz clears them

## Done in phase 5
- Exercise engine (`lib/exercises`): choice, gap, transform and word-order exercises as a typed
  union; strict grammar checking that forgives case, punctuation and contractions
- Reusable `ExerciseRunner` (answer, check, explanation, result with mistakes); keyboard friendly
- Grammar content as code (`src/content/grammar`): 6 lessons — A2: Present Simple vs
  Continuous, Past Simple, will vs going to; B1: Present Perfect, First and Second
  Conditional, Passive Voice — each with Ukrainian explanation, simple English, formulas,
  examples, usage, common mistakes, comparison and 8 exercises
- Content tests: every accepted answer must check as correct, word tiles must match the answer
- Database v2 (first migration): `lessonProgress` — status, best/last score, mistakes,
  bookmarks; included in backups (older backups still restore)
- Grammar list with search, level, topic and bookmark filters; lesson page; XP per correct
  answer plus a one-time completion bonus

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

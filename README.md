# EnglishOS

A personal, local-first platform for learning English — from A2 towards B2 and beyond —
with a focus on everyday, professional and IT/frontend English.

Vocabulary with spaced repetition, grammar, quizzes, reading, listening, speaking, writing,
IT interview preparation and learning statistics. Works offline, installs on a phone as a
PWA, and needs no account, backend or API keys: all data stays in your browser.

> Status: foundation (phases 0–1) is done. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Typecheck, lint and run tests |
| `npm test` | Run unit tests once (`npm run test:watch` to watch) |

## Tech stack
React 19, TypeScript, Vite, SCSS modules, React Router, Dexie (IndexedDB), Zustand,
zod, lucide-react, vite-plugin-pwa, Vitest.

## Docs
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [CLAUDE.md](CLAUDE.md) — conventions used when developing with Claude Code

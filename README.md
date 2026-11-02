# Wicked Dream Music — website

Astro + Tailwind CSS v4 + TypeScript, static output. Phase 1: local design audition only.

## Run locally

```bash
npm install
npm run dev          # http://localhost:4321
```

## Design audition

`main` holds the content and a deliberately plain baseline. Each design direction lives on its own branch:

```bash
npm run audition     # lists the directions and how to switch
git switch design/signal && npm install && npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve `dist/` |
| `npm run check` | `astro check` (strict TS + content schemas) |
| `npm test` | Playwright smoke + accessibility tests against the built site |
| `npm run screenshots` | Full-page screenshots of every route at 1440×900 and 390×844 → `screenshots/<branch>/` |
| `npm run lighthouse` | Lighthouse (mobile + desktop) on every route → `lighthouse/<branch>.json` |

## Content

All copy lives in `src/content/` (Astro Content Collections, schemas in `src/content.config.ts`):

- `site/global.json` — name, nav, ticker, contact email, UI strings
- `pages/*.md` — one file per page, structured frontmatter
- `services/*.md`, `work/*.md` — one file per item, sorted by `order`

Edit copy there; never in `.astro` files.

# Design audition — summary

Three complete directions, each on its own branch cut from `main`. None are merged. All share the same content in `src/content/`, so a copy change on `main` reaches every direction with a rebase (`git switch design/<slug> && git rebase main`).

```bash
npm run audition                      # list directions + switch commands
git switch design/signal && npm install && npm run dev
```

Lighthouse figures are the **lowest score across all six routes** (`/`, `/about`, `/services`, `/work`, `/contact`, `/404`). They were run one branch at a time against `astro preview` with `npm run lighthouse`: mobile uses Lighthouse's default simulated throttling (Moto G class), desktop uses the desktop preset. Per-route numbers are in `lighthouse/<branch>.json` (local, gitignored).

Screenshots are local and gitignored. Regenerate with `npm run screenshots` on any branch. Each direction has 12 files: `screenshots/design/<slug>/{home,about,services,work,contact,404}-{desktop,mobile}.png` (desktop 1440×900, mobile 390×844, full page).

---

## A — `design/signal` · Poster / loud accent

**Pitch.** Every page is a poster: enormous condensed uppercase type against tiny tracked labels, on full-bleed bands that alternate ink and paper on a strict 12-column grid. The lavender→pink gradient is the only colour on the site, so it reads like a signal light.

**Type.** Anton (display, `@fontsource/anton`, preloaded) + Instrument Sans Variable (body/labels, `@fontsource-variable/instrument-sans`). Anton's tall, heavy condensed caps sit closest to the wordmark.

**Gradient.**
- The wordmark: inline SVG, vertical lavender→pink.
- CTA fills.
- The ticker marquee band.
- The 1px rule under the fixed nav.
- Active-nav underline and the hover wipe on service rows.
- The full stop on every display headline.
- The 404 numerals.

Photos are grayscale and high contrast, multiplied over the gradient, with the blacks lifted to ink. The gradient is only ever text on ink; on paper bands it appears only as a fill or a rule.

**Highlights.**
- Home hero: the gradient wordmark at real scale, with "WHERE MUSIC / MEETS VISION." at ~12vw.
- Services: giant one-line rows that open (native `<details>`) to show the summary and bullets.
- Work: duotone poster bands.
- Mobile nav: a full-screen overlay with the nav items in huge Anton type.

**Push further.** Mask a duotone photo inside the giant wordmark/headline for one hero moment; add a scroll-linked scale shift on the services rows.

**JS.** Vanilla only:
- Mobile menu: focus trap, Escape to close, scroll lock.
- IntersectionObserver fade-up.
- `/services#id` opens the matching row.

| Lighthouse (min) | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| Mobile | 96 (`/work`; all others 100) | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

---

## B — `design/archive` · Editorial / one-page archive

*Revised over several review rounds: a single page with a full-screen video hero, expandable services and work, and one email call to action.*

**Pitch.** The whole company on one fast scroll. It opens on a full-screen loop from the ALL MY GIRLS video with the lavender wordmark over it, then runs through services, about and work as numbered, expandable sections, and ends on a single big email link.

**Type.** Archivo Variable (`@fontsource-variable/archivo`, preloaded). Display is set at 70% width and weight 780, a heavy condensed cut that echoes the wordmark; body text uses Archivo at normal width. JetBrains Mono Variable handles labels and numbering. Both are OFL.

**Palette: "chrome".** Ink `#0F0F10`, paper `#F7F7F5`, a silver accent `#E4E2DC` and a pewter accent `#A9A9B3`.
- Every section sits on the near-black ground; silver is kept for the email link and the quote.
- The hero loop is graded black and white to match.
- Every text pairing passes AA: ink/paper 17.9:1, silver/ink 14.8:1, muted/paper 6.0:1.
- The brand lavender and pink remain the client's logo colours in `--wdm-*`, but this direction doesn't use them.

Chosen from an in-page audition of 6 palettes × 5 type pairings. The comparison sheets are in `screenshots/design/archive/audition/` (local).

**Page order.**
1. **Hero.** A pinned scroll sequence over the black-and-white video loop, with the wordmark top left in the header. "Artist development starts with *sound*" is too big for the screen and runs across as you scroll; "sound" opens into songwriting, production, performance and emotion, which close on "brand". Services follow straight after. The words are in `pages/home.md` (`headline`, `hero_expand`). With reduced motion or no JS it is stacked text. The footer row lists the services, the button and the video title.
2. **Words and photos.** "Artists. Ideas. Sound. Culture." set huge, with the four work photos inline. Each word keeps its photo beside it: two pairs per line on desktop, one per line on phones. Each photo opens its work entry.
3. **Services** (`#services`). Numbered rows that expand to show their bullets.
4. **About** (`#about`). An ink band. Each chapter is a row with the title on the left and the body on the right; there is one chapter for now, to be expanded. The pull quote below is set in lavender-to-pink gradient type.
5. **Selected work** (`#work`). Expandable rows: the Miley portrait, the click-to-play YouTube video for International A&R, and the photos.
6. **Contact** (`#contact`). A silver band with the headline, intro and one giant `mailto:` link. **The form was removed at John's request.** Phase 2 needs no form backend for this direction.

**Accent.** The silver-to-pewter gradient is used on the hovered photos, the video play button and the pull quote's type. The wordmark, the main button and the contact band are solid silver.

**Video hero.**
- The loop starts after the page has loaded, pauses off-screen, and never autoplays for visitors with reduced motion turned on.
- The title in the hero's footer row ("ALICE - ALL MY GIRLS") is also the pause/play button, so the WCAG 2.2.2 pause requirement is met without a visible control.
- The poster is the LCP image.

**Old routes.** `/about`, `/services`, `/work` and `/contact` redirect to their sections (static meta-refresh pages; Phase 2 should replace these with real 301s in the host's redirect config).

**Motion** (all off under reduced motion):
- Masked line reveals.
- Photos unmask and drift with parallax.
- The video pushes in slowly through the hero sequence.

**Push further.** Short loops cut from the Imin film for the work rows. A nav order that matches the page order (Services now comes before About). Real metadata per work entry.

**JS.** Vanilla only:
- Mobile menu.
- Scroll reveals.
- Active-section nav marker.
- Accordion deep links.
- Video start/stop.
- YouTube facade swap.

**Branch-specific tooling.** `scripts/routes.ts` lists `/` and `/404`, and the smoke test also checks that each old route lands on its section.

| Lighthouse (min, `/` and `/404`) | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| Mobile | 99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

---

## C — `design/dream` · Atmospheric / cinematic

**Pitch.** The site plays like a title sequence: the guitarist-haze photo pushed into deep violet with the gradient wordmark over it like a film poster, while soft lavender/pink light drifts slowly behind every page. Below the hero it's roomy and calm: large rounded panels, generous spacing, and sections that come into focus from a slight blur as you scroll.

**Type.** Unbounded Variable (display, preloaded, `@fontsource-variable/unbounded`) + Figtree Variable (body, `@fontsource-variable/figtree`), with size-adjusted fallbacks to limit layout shift.

**Gradient.**
- The wordmark (hero, nav, footer, and a ghost version on the 404).
- `background-clip: text` on page H1s only.
- A 1px edge-light that fades in on the service cards on hover and focus-within.
- Rules, bullet dots and the work-strip progress bar.
- Four very-low-opacity radial glows. They animate `transform` only, with no `filter: blur`, and carry the only `will-change` on the site.

The hero photo is multiplied onto a violet field, so the worst-case wordmark contrast is 4.89:1.

**Highlights.**
- Home work strip:
  - Horizontal scroll-snap on desktop.
  - The scroller is a focusable region named by its heading, and arrow keys step one card at a time.
  - On mobile it becomes a staggered vertical stack and stops being a tab stop.
- Staggered service cards.
- Every page closes with a shared contact panel.

**Push further.** Scroll-driven motion: glows that follow scroll depth and the wordmark easing apart from the photo as you leave the hero, done with CSS scroll-driven animations so it stays off the main thread. Plus scene-style transitions into each work entry.

**JS.** Vanilla only:
- Mobile menu.
- Reveal observer.
- Strip arrow-key handling, plus a ResizeObserver that removes the tab stop when the strip isn't scrollable.

The strip's progress bar uses CSS scroll-driven animation, no JS.

| Lighthouse (min) | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| Mobile | 96 (`/work`; all others 100) | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

---

## Verified on every branch

- `npm run check`: 0 errors, 0 warnings. `npm run build` has no image or font warnings.
- `npm test`: 22/22 pass. The suite covers:
  - Every route returns 200 with exactly one `<h1>` and one header, main and footer.
  - Unknown URLs get the 404 page.
  - No external font or CDN links.
  - `A&R` renders correctly.
  - The skip link is the first tab stop.
  - Every tab stop has a visible focus style.
  - No animations run under `prefers-reduced-motion: reduce` after scrolling.
- Keyboard pass at 390px:
  - The menu button opens the menu with Enter and focus moves inside.
  - The page scroll is locked while it's open.
  - Escape closes it and returns focus to the button.
  - No route scrolls horizontally.
- Custom components:
  - Archive's floating image appears on keyboard focus.
  - Dream's strip scrolls with the arrow keys and has a visible focus ring.
- No React/Vue/Svelte islands anywhere. Only small inline vanilla scripts.

---

## Decisions to sanity-check

1. **Logo vectorisation.** The white PNG was traced with potrace into a single-path SVG (`src/assets/brand/logo.svg`, `fill="currentColor"`). It came out clean, so no typeface substitution was needed. The PNGs are kept as fallbacks.
2. **Brand colours were sampled from the PNGs**, not taken from the brief's guesses:
   - ink `#13061A` (brief: `#140C1C`)
   - lavender `#D4B2FD` (`#C8B4FF`)
   - pink `#FEC0D0` (`#FFB8C8`)
   - paper `#FDFCF8` (`#F5F2EB`)

   `--wdm-black` stays at `#111111`; the flat logo's ground is actually `#151514`.
3. **Placeholder email** `hello@wickeddreammusic.com` (in `site/global.json`) is **unconfirmed**. So is the production URL `https://wickeddreammusic.com` in `astro.config.mjs`, which is used only for canonical and OG tags.
4. **Copy corrections:**
   - `A&R;` → `A&R` throughout.
   - "Miley Cyrus - Wrecking Ball" (hyphen in the PDF) → "Miley Cyrus — Wrecking Ball" (em dash, as in the brief).
5. **Copy I had to add** (not in the mockup; all in content files, so editable):
   - The 404 page: "Lost in the dream." / "The page you're looking for doesn't exist or has moved." / "Back to home".
   - The form button: "Send inquiry".
   - The mailto lead-in: "Prefer email?".
   - The site meta description.
   - Alt text for the four photos.
   - UI strings in `site.ui` (skip link, Menu/Close, nav landmark labels, "All rights reserved.").
6. **Miley Cyrus portrait** (`src/assets/photos/miley-cyrus.webp`, 2400×3600), supplied by John for the Wrecking Ball entry. It is a third-party press-style photo, so confirm the licence or permission before launch.
7. **YouTube video** on International A&R: "ALICE - ALL MY GIRLS (VISUALIZER)", title taken from YouTube's oEmbed. Confirm it's the right video and that the client has the right to feature it. Only archive renders it.
8. **Hero video (archive).**
   - The loop behind archive's hero is cut from John's "Alice Vid.mp4" (the ALL MY GIRLS music video).
   - It uses six shots, about 10.5 seconds in all, with no sound, graded black and white for archive's chrome palette. The strobe-like stretch at 47–50s is deliberately left out.
   - There are two encodes in `public/media/hero/`: a 1280×720 landscape cut and a 720×1280 portrait crop for phones, each as MP4 and WebM (1.2–2 MB each).
   - It is set in `pages/home.md` under `hero_video`, so it can be swapped later.
   - The source files in `src/assets/videos/` are gitignored. Confirm the client may use this footage.
   - The loops were cut with `ffmpeg-static`, a dev dependency.
9. **Photos are Unsplash placeholders** and must be replaced with licensed or owned imagery before launch. Their pairing with work entries is arbitrary.
10. **Contact form** has correct `name`s and `method="POST"` but no action. A comment marks the Phase 2 hookup (Cloudflare Pages Function or Netlify form). Archive has no form; it uses a single mailto link.
11. **Content the designers wished existed** (not added, to keep content identical across branches; worth deciding before Phase 2):
   - Per-work `year`/`role` fields.
   - A short label for home section headings (nav labels are reused).
   - An explicit about-page `pull_quote`.
   - An optional about-page image.
   - Labels for prev/next and "next page" controls.
12. **Image sizing.** Astro emits the full-size original (2–3.5 MB here) when an `<Image>` has `widths` but no `width`. I fixed this on `main` and on every branch, so the largest shipped photo variant is now ~0.6–1 MB (a 2200px confetti shot, which compresses badly).
13. **Mobile Performance is 96 on `/work`** in signal and dream (archive no longer has a `/work` page). That page leads with large, noisy confetti photos. It's comfortably above the floor, but real photography will change the numbers.
14. **Constraints not met:** none.

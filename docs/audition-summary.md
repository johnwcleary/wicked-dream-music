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

## B — `design/archive` · Editorial / portfolio index

**Pitch.** The company presented as one numbered archive: every image is a catalogued plate with a monospace caption, on a calm paper ground with hairlines and indexes. The gradient appears only where it means something: on the wordmark, and on one hover moment.

**Type.** Instrument Sans Variable, using the width axis at ~88% for tight, slightly condensed statements that echo the logo (`@fontsource-variable/instrument-sans`, preloaded) + IBM Plex Mono 400 for labels, numbering and captions (`@fontsource/ibm-plex-mono`).

**Gradient.** Used twice, nowhere else:
1. The hero wordmark, shown as "Plate [00]": the gradient logo on an ink plate. It fills bottom-up during a once-per-session 00%→100% counter. The counter is skipped under reduced motion and never hides content.
2. The Selected Work list on home: hovering or keyboard-focusing a row reveals its photo in a floating frame, washed in the gradient.

Every other photo is greyscale.

**Highlights.**
- Varied-aspect photo field (4:5, 3:2, 1:1, 16:10).
- Ticker set as a static staircase statement.
- Services as a numbered 01–04 index with sub-numbered bullets (01.1…).
- About page: text-forward, with a pull quote taken from the body copy.
- Interior pages end with a large "next page" link.
- `WDM©` monogram derived from `site.name`.

**Push further.** Extend the floating-image moment site-wide (scroll-linked plate reveals, the Work page as a full-screen contact sheet), and add real per-work metadata (year, role) once the content model has it.

**JS.** Vanilla only:
- Mobile menu.
- Floating-image follower: preloads near the viewport; shows inline thumbnails on touch, small screens or without JS.
- Once-per-session intro: `sessionStorage` wrapped in try/catch.

| Lighthouse (min) | Perf | A11y | Best Pr. | SEO |
|---|---|---|---|---|
| Mobile | 98 (`/work`; all others 100) | 100 | 100 | 100 |
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
6. **Photos are Unsplash placeholders** and must be replaced with licensed or owned imagery before launch. Their pairing with work entries is arbitrary; for example, the purple crowd shot illustrates the Wrecking Ball credit.
7. **Contact form** has correct `name`s and `method="POST"` but no action. A comment marks the Phase 2 hookup (Cloudflare Pages Function or Netlify form).
8. **Content the designers wished existed** (not added, to keep content identical across branches; worth deciding before Phase 2):
   - Per-work `year`/`role` fields.
   - A short label for home section headings (nav labels are reused).
   - An explicit about-page `pull_quote`.
   - An optional about-page image.
   - Labels for prev/next and "next page" controls.
9. **Image sizing.** Astro emits the full-size original (2–3.5 MB here) when an `<Image>` has `widths` but no `width`. I fixed this on `main` and on every branch, so the largest shipped photo variant is now ~0.6–1 MB (a 2200px confetti shot, which compresses badly).
10. **Mobile Performance is 96–98 on `/work`** in every direction. That page leads with large, noisy confetti photos. It's comfortably above the floor, but real photography will change the numbers.
11. **Constraints not met:** none.

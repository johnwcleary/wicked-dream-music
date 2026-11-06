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

**Pitch.** A title sequence, then the whole company on one scroll. It opens on full-screen footage with the WDM logo centred. The footage then plays inside the letters of a headline on a beige sheet; "sound" holds still and the words around it change to "your *sound* is your *brand*". "our work" and three full-screen films follow, then short sections, ending in one email button and the logo.

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

**Pitch.** A title sequence, then the whole company on one scroll. It opens with the headline cut out of a dark sheet, so the ALL MY GIRLS loop plays inside the letters; thin lines draw from "sound" to the words below it, then close on "your sound is your brand". The sheet lifts to show the video at full screen under "Our work", and numbered, expandable sections follow, ending in one big email call to action.

**Type.** One typeface, Inter Tight (`@fontsource-variable/inter-tight`, OFL, preloaded): large type at weight 500–600 with very tight spacing, small type at normal spacing. Text uses standard capitalization, as written in the content files. Only "sound" and "brand" are italic. The direction takes its restraint from a neutral portfolio reference John supplied.

**Color.** John chose black over the blue and purple auditioned here: black type on the beige page, with deep purple in the word "sound" and a little of the logo's lavender rising from the page's bottom right corner. The films run untinted: color only appears over footage inside the type, and a neutral fade or shade sits behind small text on footage to keep it AA. Over the opening, the nav and buttons are white to match the logo.

**Palette.** Near-black `#0F0F10` type on light beige `#F4EEE3` (16.6:1), `#5E5A54` for small text (5.9:1). The wordmark, font and colour are set out in `docs/brand/wdm/`.
- The hero loop and the IMIN loop are in full color; the footage shows through the type on the beige sheet (`mix-blend-mode: lighten`), shaded 50% so the brightest frames keep 3.1:1 (large text).
- "our work" and the header over the films sit on dark shades instead (3.4:1 or better).
- The brand lavender and pink remain the client's logo colours in `--wdm-*`. This direction only uses the lavender, in the corner at the foot of the page.

Chosen from an in-page audition of 6 palettes × 5 type pairings. The comparison sheets are in `screenshots/design/archive/audition/` (local).

**Page order.**
1. **Hero.** The page opens on the ALL MY GIRLS loop at full screen, with the white Wicked Dream Music logo centred (`src/assets/brand/wdm-lockup-white.webp`, John's own clean export at 2000px, larger than the hero ever draws it), an "artist development and a&r consulting" pill and the nav centred at the top, drawing on AWAL's opening. A beige sheet then scrolls up over the footage, with the type as a window onto it. "Artist development begins with *vision*" pins, and "vision" stays exactly where it is while the other words leave and "shapes your *sound*" arrives around it. "sound" then stays still in the same way while "Your … defines your *brand*" arrives, followed by "Let's develop it together", centred on the page beneath them. "vision" and "sound" are purple. All the kept words share a left edge, with the words before them set against it; on phones everything stacks on that edge. Next, "our work" sits over the IMIN film and shrinks to the top, followed by a loop from Torri Wolff's "Colours", then the ALICE loop last, all full screen. The words and films are in `pages/home.md` (`headline`, `hero_closing`, `hero_video`, `hero_films`); the middle line must start with the headline's last word and end on a word the closing line also has. With reduced motion or no JS the type is still and stacked, over the posters.
2. **About** (`#about`). "our story" with a short paragraph (`story`, John's copy), then "our founder" with David Kim's name inline at the start of his bio, straight after the last film, on the page's own background so it flows into services. Both are in `pages/about.md`.
3. **Services** (`#services`). An "our services" title, then artist development, a&r consulting and sync licensing under one another. Each title is filled with a still from one of the films, drifting as you scroll, and starts open on a compact grid of its offerings, which the + closes. The "customers include" line is off the page for now, commented out in `pages/services.md`; John supplied the names, so confirm they can be named before it returns.
4. **Selected works** (`#work`). A large centred title over one embedded Spotify playlist, set in `pages/work.md` (`playlist`). **The current playlist is a placeholder from John.** The iframe loads lazily as it nears the screen, and Spotify may set cookies once it loads, so check that against the privacy policy.
5. **Contact** (`#contact`). The headline, intro and one giant `mailto:` link. **The form was removed at John's request.** Phase 2 needs no form backend for this direction.

**Accent.** None: the current nav item is a dark pill. There are no section numbers, sub-labels or horizontal rules, at John's request.

**Video hero.**
- The loop starts after the page has loaded, pauses off-screen, and never autoplays for visitors with reduced motion turned on.
- A small "pause video" control in the hero's footer row pauses and plays both loops, which WCAG 2.2.2 requires for video that keeps moving.
- The poster is the LCP image.

Everything below the films, from the about section through the footer, has tighter margins than the hero. Everything there is centred, and the service boxes and the playlist share one narrower width. About and services each fill at least the screen with their content centred up and down. A band above and below services shows the opening's footage held still behind the page; tapping one pauses the loops.

**Sync brands.** Netflix, Hulu, Paramount, MTV, Nickelodeon, AMC, NFL and Discovery Channel logos sit under sync licensing (`services/sync-licensing.md`, `brands`), from files John supplied, cropped and with their white backgrounds removed (`src/assets/brand/sync/`). Confirm the rights to name and show each brand. The sync definitions are drafts for John and David to check.

**Favicon.** The WD mark from John's logo, white on the site's near-black (`public/favicon.svg`, with PNGs for browsers and phones that don't use the SVG).

**Old routes.** `/about`, `/services`, `/work` and `/contact` redirect to their sections (static meta-refresh pages; Phase 2 should replace these with real 301s in the host's redirect config).

**Motion** (all off under reduced motion):
- The services and selected works titles fade up; the hero's words change around "sound" with the scroll. The founder and contact text don't animate, at John's request.
- The video pushes in slowly through the hero sequence.

**Push further.** A portrait of David Kim beside his bio.

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
3. **Email** `wickeddreammusic@gmail.com` (in `site/global.json`) is John's. The production URL is still **unconfirmed**: `https://wickeddreammusic.com` in `astro.config.mjs`, used only for canonical and OG tags.
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
   - It uses six shots, about 10.5 seconds in all, in color. The strobe-like stretch at 47–50s is deliberately left out.
   - There are two encodes in `public/media/hero/`: a 1280×720 landscape cut and a 720×1280 portrait crop for phones, each as MP4 (1–2.6 MB each; iPhones play MP4 most reliably).
   - It is set in `pages/home.md` under `hero_video`, so it can be swapped later.
   - The source files in `src/assets/videos/` are gitignored. Confirm the client may use this footage.
   - The loops were cut with `ffmpeg-static`, a dev dependency.
   - All three loops now carry sound, heard only in the work section, while a film is at the middle of the screen; the opening loop stays silent. Browsers refuse sound until a visitor has tapped, clicked or pressed a key on the page, so until then the films play silently and the speaker reads "turn sound on". Each track is one unbroken passage of the song (ALICE from 0:37, IMIN from 2:01, Torri Wolff from 1:42), chosen by loudness and evened out to -14 LUFS, so it is not in sync with the cut-together picture. Confirm the recordings may be used as well as the footage.
9. **Photos are Unsplash placeholders** and must be replaced with licensed or owned imagery before launch. Their pairing with work entries is arbitrary.
10. **Service definitions** in `services/*.md` (`offerings`) are drafted from John's service list and the site's "your sound is your brand" line, for John and David to check they describe the work as it's really done. **David Kim bio** is John's supplied copy, used verbatim; the artist names and "award-winning" should be confirmed by David before launch. **Hero blend** (`mix-blend-mode` over `<video>`) has been checked in desktop Chromium only, so test it in iOS Safari.
    **Torri Wolff loop** is cut from John's "Torri Wolff Colous.mp4", using shots without bare skin and keeping its "COLOURS" title card, so confirm the rights and the shot choice. **IMIN loop** is cut from John's "Imin vid.mp4" (shots chosen to avoid its burned-in captions). The title "IMIN" is taken from the file name and has no song name yet, so confirm it and the right to use the footage. Each film shows its `title` as a credit at bottom right.
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

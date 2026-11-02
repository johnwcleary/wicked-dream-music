/**
 * Colour palettes and type pairings auditioned on this branch.
 * The values live in src/styles/audition.css; this list drives the switcher.
 * Remove the switcher (and the losers) once a direction is chosen.
 */
export const palettes = [
  { id: 'brand', label: 'Brand lavender', swatch: ['#13061a', '#d4b2fd', '#fec0d0', '#fdfcf8'] },
  { id: 'blush', label: 'Plum & blush', swatch: ['#1a0812', '#ffb4c6', '#ffd6b0', '#fbf5f0'] },
  { id: 'cobalt', label: 'Midnight & periwinkle', swatch: ['#0a0f24', '#afc0ff', '#d9ccff', '#f4f3ee'] },
  { id: 'acid', label: 'Black & acid', swatch: ['#0e0e0c', '#d4ff3f', '#8ff5d0', '#f2f1eb'] },
  { id: 'ember', label: 'Oxblood & coral', swatch: ['#1e0a08', '#ff9c7e', '#ffd07a', '#f7f0e8'] },
  { id: 'chrome', label: 'Mono chrome', swatch: ['#0f0f10', '#e4e2dc', '#a9a9b3', '#f7f7f5'] },
] as const;

export const typesets = [
  { id: 'instrument', label: 'Instrument Sans', note: 'condensed grotesk + Plex Mono', family: 'Instrument Sans Variable' },
  { id: 'archivo', label: 'Archivo', note: 'heavy condensed + JetBrains Mono', family: 'Archivo Variable' },
  { id: 'fraunces', label: 'Fraunces', note: 'soft serif display + Instrument', family: 'Fraunces Variable' },
  { id: 'bricolage', label: 'Bricolage', note: 'quirky grotesk + Plex Mono', family: 'Bricolage Grotesque Variable' },
  { id: 'space', label: 'Space Grotesk', note: 'techy grotesk + Space Mono', family: 'Space Grotesk Variable' },
] as const;

export const paletteIds = palettes.map((p) => p.id);
export const typeIds = typesets.map((t) => t.id);

// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Placeholder production URL (used for canonical + OG tags). Confirm in Phase 2.
  site: 'https://wickeddreammusic.com',
  vite: {
    plugins: [tailwindcss()]
  }
});
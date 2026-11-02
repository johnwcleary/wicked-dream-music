// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Placeholder production URL (used for canonical + OG tags). Confirm in Phase 2.
  site: 'https://wickeddreammusic.com',
  // Pass a parent's scoped styles through `class` props to child components.
  scopedStyleStrategy: 'class',
  // design/archive is a one-page site: the old routes land on their section.
  redirects: {
    '/about': '/#about',
    '/services': '/#services',
    '/work': '/#work',
    '/contact': '/#contact',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
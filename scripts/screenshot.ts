/**
 * Build the site, serve dist/, and capture every route at desktop and mobile
 * sizes into screenshots/<branch>/<route>-<viewport>.png.
 *   npm run screenshots            (builds first)
 *   npm run screenshots -- --no-build
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { routes, viewports } from './routes.ts';
import { currentBranch, startPreview } from './preview.ts';

const branch = currentBranch();
const outDir = `screenshots/${branch}`;
mkdirSync(outDir, { recursive: true });

const server = await startPreview(!process.argv.includes('--no-build'));
const browser = await chromium.launch();
try {
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    // Skip one-time intros (e.g. a loading counter) so screenshots show the page itself.
    await context.addInitScript(() => {
      try { sessionStorage.setItem('wdm-intro-seen', '1'); } catch {}
    });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(server.url + route.path, { waitUntil: 'networkidle' });
      // Scroll through the page so scroll-triggered reveals and lazy images settle.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.6;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(900);
      const file = `${outDir}/${route.name}-${vp.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('saved', file);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server.stop();
}

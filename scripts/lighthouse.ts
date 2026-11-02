/**
 * Build, serve, and run Lighthouse on every route (mobile + desktop).
 * Writes lighthouse/<branch>.json and prints the minimum score per category.
 *   npm run lighthouse              (builds first)
 *   npm run lighthouse -- --no-build
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { routes } from './routes.ts';
import { currentBranch, startPreview } from './preview.ts';

const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
const branch = currentBranch();
const server = await startPreview(!process.argv.includes('--no-build'));
const chrome = await chromeLauncher.launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox'],
});

type Row = { route: string; formFactor: string } & Record<(typeof categories)[number], number>;
const rows: Row[] = [];
const failures: string[] = [];
try {
  for (const formFactor of ['mobile', 'desktop'] as const) {
    for (const route of routes) {
      const config = formFactor === 'desktop' ? (await import('lighthouse/core/config/desktop-config.js')).default : undefined;
      const result = await lighthouse(
        server.url + route.path,
        { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: [...categories] },
        config,
      );
      if (!result) throw new Error('lighthouse returned nothing');
      const lhr = result.lhr;
      const row = { route: route.path, formFactor } as Row;
      for (const c of categories) row[c] = Math.round((lhr.categories[c]?.score ?? 0) * 100);
      rows.push(row);
      for (const c of categories) {
        if (row[c] < 90) {
          const audits = Object.values(lhr.audits)
            .filter((a) => a.score !== null && a.score < 0.9 && (a.scoreDisplayMode === 'binary' || a.scoreDisplayMode === 'numeric'))
            .map((a) => `${a.id}${a.displayValue ? ` (${a.displayValue})` : ''}`)
            .slice(0, 8);
          failures.push(`${formFactor} ${route.path} ${c}=${row[c]}: ${audits.join(', ')}`);
        }
      }
      console.log(formFactor.padEnd(8), route.path.padEnd(10), categories.map((c) => `${c}:${row[c]}`).join('  '));
    }
  }
} finally {
  await chrome.kill();
  server.stop();
}

mkdirSync('lighthouse', { recursive: true });
const file = `lighthouse/${branch.replace(/\//g, '-')}.json`;
writeFileSync(file, JSON.stringify(rows, null, 2));
for (const ff of ['mobile', 'desktop']) {
  const r = rows.filter((x) => x.formFactor === ff);
  console.log(`\n${ff} minimum:`, categories.map((c) => `${c} ${Math.min(...r.map((x) => x[c]))}`).join(' / '));
}
if (failures.length) console.log('\nBelow 90:\n' + failures.join('\n'));
console.log(`\nSaved ${file}`);

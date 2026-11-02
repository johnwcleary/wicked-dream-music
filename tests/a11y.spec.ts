import { test, expect } from '@playwright/test';
import { routes } from '../scripts/routes.ts';

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const href = await page.evaluate(() => document.activeElement?.getAttribute('href'));
  expect(href).toBe('#main');
});

for (const route of routes) {
  test(`${route.path}: every tab stop shows a visible focus indicator`, async ({ page }) => {
    await page.goto(route.path);
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
        const shadow = cs.boxShadow !== 'none';
        const id = el.outerHTML.slice(0, 120);
        return { id, visible: outline || shadow, tag: el.tagName };
      });
      if (!info) break;
      if (seen.has(info.id)) break;
      seen.add(info.id);
      expect(info.visible, `no focus style on ${info.id}`).toBe(true);
    }
    expect(seen.size).toBeGreaterThan(3);
  });
}

test.describe('prefers-reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' });
  for (const route of routes) {
    test(`${route.path}: no running animations`, async ({ page }) => {
      await page.goto(route.path);
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(400);
      const running = await page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === 'running')
          .map((a) => (a.effect as KeyframeEffect | null)?.target?.toString() ?? 'unknown'),
      );
      expect(running).toEqual([]);
    });
  }
});

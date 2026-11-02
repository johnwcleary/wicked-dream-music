import { test, expect } from '@playwright/test';
import { redirects, routes } from '../scripts/routes.ts';

for (const route of routes) {
  test(`${route.path} renders with one <h1>`, async ({ page }) => {
    const res = await page.goto(route.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
  });
}

for (const r of redirects) {
  test(`${r.from} lands on its section`, async ({ page }) => {
    await page.goto(r.from);
    await page.waitForURL((u) => u.pathname === '/' && u.hash === r.to.slice(1));
    const id = r.to.split('#')[1]!;
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  });
}

test('unknown URLs get the 404 page', async ({ page }) => {
  const res = await page.goto('/does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('no external font or CDN stylesheets', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path);
    const external = await page.$$eval('link[href], script[src]', (els) =>
      els
        .map((el) => el.getAttribute('href') ?? el.getAttribute('src') ?? '')
        .filter((u) => /^https?:\/\//.test(u) && !u.includes('wickeddreammusic.com')),
    );
    expect(external, route.path).toEqual([]);
  }
});

test('A&R renders correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).not.toContainText('A&R;');
  await expect(page.getByText('A&R Consulting').first()).toBeVisible();
});

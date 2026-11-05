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

test('music plays only in the work section, after a tap, and the speaker stops it', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const speaker = page.locator('.hero-foot [data-sound-toggle]');
  const audible = () => page.evaluate(() => Array.from(document.querySelectorAll('video')).filter((v) => !v.muted).length);
  const scrollTo = async (selector: string) => {
    await page.evaluate((s) => {
      const top = document.querySelector(s)!.getBoundingClientRect().top + scrollY;
      window.scrollTo({ top, behavior: 'instant' });
    }, selector);
    await page.waitForTimeout(300);
  };
  await expect(speaker).toBeHidden();
  await page.mouse.click(5, 400);
  expect(await audible()).toBe(0);

  await scrollTo('[data-reel-film]');
  await expect(speaker).toBeVisible();
  await expect.poll(audible).toBe(1);
  await speaker.click();
  await expect(speaker).toHaveAttribute('aria-label', 'Turn sound on');
  expect(await audible()).toBe(0);
  await speaker.click();
  await expect.poll(audible).toBe(1);

  await scrollTo('#about');
  await expect.poll(audible).toBe(0);
  await expect(speaker).toBeHidden();
});

test('the pause control stops every loop and starts them again', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const toggle = page.locator('.hero-foot [data-hero-toggle]');
  const playing = () => page.evaluate(() => Array.from(document.querySelectorAll('video')).filter((v) => !v.paused).length);
  await expect.poll(playing).toBeGreaterThan(0);
  await toggle.click();
  await expect(toggle).toHaveText('Play video');
  await expect.poll(playing).toBe(0);
  await toggle.click();
  await expect(toggle).toHaveText('Pause video');
  await expect.poll(playing).toBeGreaterThan(0);
});

test('each service starts open on offerings with an icon and a definition', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const rows = page.locator('details.svc');
  await expect(rows).toHaveCount(2);
  await expect(page.locator('.svc-item')).toHaveCount(11);
  await expect(page.locator('.svc-item svg')).toHaveCount(11);
  for (const row of await rows.all()) await expect(row.locator('.svc-def').first()).toBeVisible();
  await rows.first().locator('summary').click();
  await expect(rows.first().locator('.svc-def').first()).toBeHidden();
  await rows.first().locator('summary').click();
  await expect(rows.first().locator('.svc-def').first()).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute('href', /wickeddreammusic@gmail\.com/);
});

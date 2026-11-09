import { test, expect } from '@playwright/test';

// A browser that allows sound without a tap (Chrome for a returning visitor, Safari set to allow autoplay).
test.use({ launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] } });

test('a film starts with its music, no tap needed and no hint', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const speaker = page.locator('.hero-foot [data-sound-toggle]');
  // Scroll with the wheel, as a visitor would: Playwright's page scripting counts as a tap, and a
  // wheel doesn't.
  await page.mouse.move(640, 400);
  while (!(await speaker.isVisible())) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(60);
  }
  await expect.poll(() => page.evaluate(() => Array.from(document.querySelectorAll('[data-film-video]')).filter((v) => !(v as HTMLVideoElement).muted).length)).toBe(1);
  await expect(speaker).toHaveAttribute('aria-label', 'Turn sound off');
  await expect(speaker).not.toHaveClass(/is-hint/);
});

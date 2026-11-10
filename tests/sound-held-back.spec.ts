import { test, expect } from '@playwright/test';

// A browser that holds sound back until a tap, as most do on a first visit. The test browser
// always allows sound (Playwright's own page scripting counts as a tap), so the page is made to
// refuse it as a browser would: unmuted play() fails until a real click, tap or key press.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    let tapped = false;
    for (const type of ['click', 'keydown', 'touchend']) addEventListener(type, () => (tapped = true), { capture: true });
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      if (!this.muted && !tapped) {
        this.pause();
        return Promise.reject(new DOMException('Sound needs a tap', 'NotAllowedError'));
      }
      return play.call(this);
    };
  });
});

test('the opening and each film, arriving without sound, show the hint for a few seconds, and a click brings the music', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const speaker = page.locator('.hero-foot [data-sound-toggle]');
  const audible = () => page.evaluate(() => Array.from(document.querySelectorAll('video')).filter((v) => !v.muted).length);
  const silentlyPlaying = (selector: string) => page.locator(selector).first().evaluate((v: HTMLVideoElement) => !v.paused && v.muted);

  // The opening tries its music as the page loads, and is refused.
  await expect(speaker).toHaveClass(/is-hint/);
  await expect(speaker).toHaveAttribute('aria-label', 'Click for sound');
  await expect(speaker.locator('.sound-hint-click')).toBeVisible();
  // Refused, the film carries on silently rather than stopping.
  await expect.poll(() => silentlyPlaying('[data-hero-video]')).toBe(true);
  expect(await audible()).toBe(0);
  await expect(speaker).not.toHaveClass(/is-hint/, { timeout: 6000 });
  await expect(speaker).toHaveAttribute('aria-label', 'Turn sound on');

  // Scroll with the wheel, as a visitor would, past the sheet to the first film.
  await page.mouse.move(640, 400);
  for (const shown of [false, true]) {
    while ((await speaker.isVisible()) !== shown) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(60);
    }
  }
  await expect(speaker).toHaveClass(/is-hint/);
  await expect.poll(() => silentlyPlaying('[data-film-video]')).toBe(true);
  expect(await audible()).toBe(0);
  await page.mouse.click(5, 400);
  await expect.poll(audible).toBe(1);
  expect(await page.locator('[data-film-video]').first().evaluate((v: HTMLVideoElement) => v.muted)).toBe(false);
});

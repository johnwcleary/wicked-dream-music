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

test('a film arriving without sound shows the hint for a few seconds, and a click brings the music', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const speaker = page.locator('.hero-foot [data-sound-toggle]');
  const audible = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-film-video]')).filter((v) => !(v as HTMLVideoElement).muted).length);
  // Scroll with the wheel, as a visitor would.
  await page.mouse.move(640, 400);
  while (!(await speaker.isVisible())) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(60);
  }
  await expect(speaker).toHaveClass(/is-hint/);
  await expect(speaker).toHaveAttribute('aria-label', 'Click for sound');
  await expect(speaker.locator('.sound-hint-click')).toBeVisible();
  // Refused, the film carries on silently rather than stopping.
  await expect.poll(() => page.locator('[data-film-video]').first().evaluate((v: HTMLVideoElement) => !v.paused && v.muted)).toBe(true);
  expect(await audible()).toBe(0);
  await expect(speaker).not.toHaveClass(/is-hint/, { timeout: 6000 });
  await expect(speaker).toHaveAttribute('aria-label', 'Turn sound on');
  await page.mouse.click(5, 400);
  await expect.poll(audible).toBe(1);
});

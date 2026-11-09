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
  await expect(page.getByText('A&R Strategy').first()).toBeVisible();
  await expect(page.getByText(/A&R Consulting/i)).toHaveCount(0);
});

test('artist development lists its offerings in John\'s order', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#services-artist-development .svc-name')).toHaveText([
    'Songwriting & Production',
    'Performance Coaching',
    'Live Performance Development',
    'Mentorship',
    'Sonic Development',
    'Release Preparation & Strategy',
  ]);
});

test('the link preview uses the opening and the about copy', async ({ page }) => {
  await page.goto('/');
  const meta = (key: string) => page.locator(`meta[property="${key}"]`).getAttribute('content');
  expect(await meta('og:title')).toBe('Wicked Dream Music, Artist Development and A&R Strategy');
  await expect(page).toHaveTitle('Wicked Dream Music, Artist Development and A&R Strategy');
  expect(await meta('og:description')).toMatch(/^Wicked Dream Music is a boutique artist development company/);
  expect(await meta('og:image')).toMatch(/\/_astro\/og-image\.[\w-]+\.jpg$/);
  expect(await meta('og:image:width')).toBe('1200');
  expect(await meta('og:image:height')).toBe('630');
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

test('jumping to a section past the films plays none of their music on the way', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  // Count, frame by frame, how many films are audible while the page glides down to About.
  await page.evaluate(() => {
    const w = window as unknown as { loudest: number };
    w.loudest = 0;
    const watch = () => {
      const audible = Array.from(document.querySelectorAll<HTMLVideoElement>('[data-film-video]')).filter((v) => !v.muted).length;
      w.loudest = Math.max(w.loudest, audible);
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });
  await page.locator('#site-menu a[data-section="about"]').click();
  await expect.poll(() => page.evaluate(() => document.getElementById('about')!.getBoundingClientRect().top), { timeout: 8000 }).toBeLessThan(200);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => (window as unknown as { loudest: number }).loudest)).toBe(0);
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
  await expect(rows).toHaveCount(3);
  await expect(page.locator('.svc-item')).toHaveCount(12);
  await expect(page.locator('.svc-item svg')).toHaveCount(12);
  const logos = await page.locator('.svc-brands img').evaluateAll((els) => els.map((el) => el.getAttribute('alt')));
  expect(logos).toEqual(['Netflix', 'Hulu', 'Paramount', 'MTV', 'Nickelodeon', 'AMC', 'NFL', 'Discovery Channel']);
  for (const row of await rows.all()) await expect(row.locator('.svc-def').first()).toBeVisible();
  await rows.first().locator('summary').click();
  await expect(rows.first().locator('.svc-def').first()).toBeHidden();
  await rows.first().locator('summary').click();
  await expect(rows.first().locator('.svc-def').first()).toBeVisible();
  await expect(page.locator('a[href^="mailto:"]').first()).toHaveAttribute('href', 'mailto:david.kim@wickeddreammusic.com');
});

test('about sits above services and has no video behind it', async ({ page }) => {
  await page.goto('/');
  const order = await page.locator('main section[id]').evaluateAll((els) => els.map((el) => el.id));
  expect(order.indexOf('about')).toBeLessThan(order.indexOf('services'));
  await expect(page.locator('#about video')).toHaveCount(0);
  await page.evaluate(() => document.getElementById('about')!.scrollIntoView({ behavior: 'instant' }));
  await expect(page.locator('#site-menu a[aria-current]')).toHaveAttribute('data-section', 'about');
});

test('each film in the work section is credited', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-reel-film] .film-credit')).toHaveText([/imin - satisfied/i, /joe marson - no retreat/i, /torii wolf - ten billion years/i, /lawd ito - composure/i]);
});

test('video gaps sit either side of services and pause the loops', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const order = await page.locator('main > *').evaluateAll((els) => els.map((el) => el.id || el.className));
  const services = order.indexOf('services');
  expect(order[services - 2]).toBe('about');
  expect(order[services - 1]).toContain('sliver');
  expect(order[services + 1]).toContain('sliver');
  expect(order[services + 2]).toBe('work');
  const toggle = page.locator('.sliver-toggle').last();
  const video = page.locator('[data-sliver-video]').last();
  await toggle.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await toggle.click();
  await expect(toggle).toHaveText('Play video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('the hero keeps vision, then sound, as its three lines change', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(/^\s*Artist development\s+begins with\s+vision\s*$/);
  await expect(page.locator('.step').nth(1)).toHaveText(/^\s*vision\s+shapes\s+your\s+sound\s*$/);
  await expect(page.locator('.step').nth(2)).toHaveText(/^\s*Your\s+sound\s+defines your\s+brand\s*$/);
  const read = async (progress: number) => {
    await page.evaluate((p) => {
      const track = document.querySelector<HTMLElement>('[data-hero-track]')!;
      const top = track.getBoundingClientRect().top + scrollY;
      window.scrollTo({ top: top + p * (track.offsetHeight - innerHeight), behavior: 'instant' });
    }, progress);
    await page.waitForTimeout(1000);
    return page.evaluate(() => {
      const look = (el: Element) => {
        const box = el.getBoundingClientRect();
        return { x: Math.round(box.left), y: Math.round(box.top), opacity: Number(getComputedStyle(el).opacity), color: getComputedStyle(el).color };
      };
      return {
        vision: look(document.querySelector('em[data-step-out="2"]')!),
        sound: look(document.querySelector('em[data-step-in="1"]')!),
        brand: look(document.querySelector('em[data-step-in="2"]')!),
      };
    });
  };
  const first = await read(0);
  const second = await read(0.35);
  const third = await read(0.85);
  expect(first.vision.opacity).toBe(1);
  expect(first.sound.opacity).toBe(0);
  expect(second.vision).toEqual(first.vision);
  expect(second.sound.opacity).toBe(1);
  expect(second.vision.color).toBe(second.sound.color);
  expect(third.vision.opacity).toBe(0);
  expect(third.sound).toEqual(second.sound);
  expect(third.brand.opacity).toBe(1);
});

test('the header logo appears once the opening has been scrolled past, and goes home', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const logo = page.locator('.bar-logo');
  await expect(logo).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 1.2, behavior: 'instant' }));
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute('aria-label', 'Wicked Dream Music');
  await page.waitForTimeout(600);
  const box = (await logo.boundingBox())!;
  const home = (await page.locator('#site-menu a').first().boundingBox())!;
  expect(box.height).toBeCloseTo(home.height, 0);
  expect(box.width).toBeCloseTo(box.height, 0);
  expect(box.y).toBeCloseTo(home.y, 0);
  expect(box.x).toBeLessThan(home.x);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(logo).toBeVisible();
  await logo.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
  await expect(logo).toBeHidden();
});

test('section and service titles arrive without moving', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.sh-title').first()).toBeAttached();
  await expect(page.locator('.sh-title[data-reveal], .svc-title[data-reveal]')).toHaveCount(0);
});

test('the contact heading matches the other section headings', async ({ page }) => {
  await page.goto('/');
  const size = (id: string) => page.locator(id).evaluate((el) => getComputedStyle(el).fontSize);
  expect(await size('#contact-title')).toBe(await size('#services-title'));
});

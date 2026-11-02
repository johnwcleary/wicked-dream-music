import { defineConfig } from '@playwright/test';

// Override with WDM_TEST_PORT when running several branches side by side.
const port = Number(process.env.WDM_TEST_PORT ?? 4398);

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `npm run build && npx astro preview --ignore-lock --port ${port} --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

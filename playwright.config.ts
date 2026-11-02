import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4398' },
  webServer: {
    command: 'npm run build && npx astro preview --ignore-lock --port 4398 --host 127.0.0.1',
    url: 'http://127.0.0.1:4398',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});

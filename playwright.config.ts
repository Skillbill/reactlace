import { defineConfig } from '@playwright/test'

// Uses the system Chrome by default; set PW_CHANNEL= (empty) to run on the
// Chromium downloaded by `npx playwright install chromium`
const channel = process.env.PW_CHANNEL ?? 'chrome'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5199',
    browserName: 'chromium',
    channel: channel || undefined,
    actionTimeout: 5_000,
    viewport: { width: 1280, height: 1600 }
  },
  webServer: {
    command: 'npx vite --config tests/e2e/vite.config.ts',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI
  }
})

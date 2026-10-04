import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: '.',
  testMatch: ['typescript/tests/**/*.spec.ts', 'javascript/tests/**/*.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // More parallel browsers than this max out CPU/RAM on an 8-core, 8 GB machine and cause random timeouts.
  workers: process.env.CI ? 1 : 2,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: process.env.JENKINS_URL
    ? // Jenkins: HTML report (HTML Publisher plugin) and JUnit XML (test trend charts).
      [['html', { open: 'never' }], ['junit', { outputFile: 'reports/junit.xml' }], ['list']]
    : process.env.GITHUB_ACTIONS
      ? // GitHub Actions: each browser job writes a blob report (merged into one HTML report by the
        // "report" job), and the "github" reporter adds failure annotations to the run summary.
        [['blob', { fileName: `report-${process.env.BLOB_NAME ?? 'ci'}.zip` }], ['github'], ['list']]
      : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'https://demowebshop.tricentis.com',
    // Clicks that submit a form wait for the server to respond, which can take a while on this site.
    actionTimeout: 45_000,
    navigationTimeout: 60_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Recording every test is CPU-heavy; record only the retry of a failed test.
    video: 'on-first-retry',
  },
  projects: [
    // Registers one shared test account before any browser project runs.
    { name: 'setup', testMatch: 'setup/account.setup.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    // Several Firefox instances in parallel stall on this machine (renderer errors, page loads time out).
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, workers: 1, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
  ],
});

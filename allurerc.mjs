// Allure 3 report configuration, used by `npm run report:allure` and the CI pipelines.
import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Demo Web Shop – Playwright E2E',
  output: './allure-report',
  // Keeps pass/fail history between runs for the trend charts (git-ignored; persists in a Jenkins workspace).
  historyPath: './allure-history.jsonl',
  historyLimit: 30,
  plugins: {
    awesome: {
      options: {
        reportName: 'Demo Web Shop – Playwright E2E',
        reportLanguage: 'en',
        // One self-contained index.html (used by Jenkins, whose report sandbox blocks the data requests
        // a multi-file report makes). Larger, since every screenshot is embedded.
        singleFile: process.env.ALLURE_SINGLE_FILE === 'true',
        // Tree in the report: browser → spec file → describe block (e.g. "Cart - Negative") → test.
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
  },
});

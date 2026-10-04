import fs from 'fs';
import path from 'path';

/**
 * Runs once before the whole test run (not per worker).
 * Clears the previous run's Allure results so each report shows only the latest run.
 * Trend history is kept separately in allure-history.jsonl (see allurerc.mjs).
 */
export default function globalSetup() {
  fs.rmSync(path.join(__dirname, '..', 'allure-results'), { recursive: true, force: true });
}

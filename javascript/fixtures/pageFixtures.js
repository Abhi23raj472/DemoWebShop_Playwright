// @ts-check
const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');

// Written by setup/account.setup.ts, which runs once before the browser projects.
const ACCOUNT_FILE = path.join(__dirname, '..', '..', '.auth', 'account.json');

/**
 * @typedef {Object} Pages
 * @property {HomePage} homePage
 * @property {LoginPage} loginPage
 * @property {RegisterPage} registerPage
 */

/**
 * @typedef {Object} WorkerFixtures
 * The registered account shared by all tests (from .env, or created by the setup project).
 * @property {{ email: string, password: string }} account
 */

const test = base.test.extend(
  /** @type {import('@playwright/test').Fixtures<Pages, WorkerFixtures, import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions, import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions>} */ ({
    homePage: async ({ page }, use) => {
      await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
      await use(new RegisterPage(page));
    },

    account: [
      async ({}, use) => {
        await use(JSON.parse(fs.readFileSync(ACCOUNT_FILE, 'utf-8')));
      },
      { scope: 'worker' },
    ],
  })
);

module.exports = { test, expect: base.expect };

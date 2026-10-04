import fs from 'fs';
import path from 'path';
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Written by setup/account.setup.ts, which runs once before the browser projects.
const ACCOUNT_FILE = path.join(__dirname, '..', '..', '.auth', 'account.json');

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
};

type Account = { email: string; password: string };

type WorkerFixtures = {
  // The registered account shared by all tests (from .env, or created by the setup project).
  account: Account;
};

export const test = base.extend<Pages, WorkerFixtures>({
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
});

export { expect };

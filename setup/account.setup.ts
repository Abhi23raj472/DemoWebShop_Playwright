import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { RegisterPage } from '../typescript/pages/RegisterPage';
import { uniqueEmail } from '../typescript/utils/helpers';
import users from '../test-data/users.json';

const ACCOUNT_FILE = path.join(__dirname, '..', '.auth', 'account.json');

// Runs once before all browser projects: provides one registered account for every test.
setup('create test account', async ({ page }) => {
  let account: { email: string; password: string };

  if (process.env.USER_EMAIL && process.env.USER_PASSWORD) {
    account = { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD };
  } else {
    const registerPage = new RegisterPage(page);
    const newUser = { ...users.newUser, email: uniqueEmail('pw') };
    await registerPage.goto();
    await registerPage.register(newUser);
    await expect(registerPage.result).toContainText('Your registration completed');
    account = { email: newUser.email, password: newUser.password };
  }

  fs.mkdirSync(path.dirname(ACCOUNT_FILE), { recursive: true });
  fs.writeFileSync(ACCOUNT_FILE, JSON.stringify(account, null, 2));
});

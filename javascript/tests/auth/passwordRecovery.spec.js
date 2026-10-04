// @ts-check
/**
 * Feature: Password recovery ("Forgot password?", /passwordrecovery)
 * Positive: recovery email for a registered account.
 * Negative: unknown, empty and badly formatted email.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { uniqueEmail } = require('../../utils/helpers');
const users = require('../../../test-data/users.json');

test.describe('Password recovery - Positive', () => {
  // A registered customer gets a recovery email. (This only sends an email; the password is unchanged.)
  test('TC_PWD_01: recovery email is sent for a registered account', async ({ account, passwordRecoveryPage }) => {
    await passwordRecoveryPage.goto();
    await passwordRecoveryPage.recover(account.email);
    await expect(passwordRecoveryPage.result).toHaveText('Email with instructions has been sent to you.');
  });

  // The "Forgot password?" link on the login page leads here.
  test('TC_PWD_02: "Forgot password?" link opens password recovery', async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await expect(page).toHaveURL(/\/passwordrecovery/);
  });
});

test.describe('Password recovery - Negative', () => {
  test.beforeEach(async ({ passwordRecoveryPage }) => {
    await passwordRecoveryPage.goto();
  });

  test('TC_PWD_03: unregistered email shows "Email not found."', async ({ passwordRecoveryPage }) => {
    await passwordRecoveryPage.recover(uniqueEmail('nobody'));
    await expect(passwordRecoveryPage.result).toHaveText('Email not found.');
  });

  test('TC_PWD_04: empty email is rejected', async ({ passwordRecoveryPage }) => {
    await passwordRecoveryPage.recoverButton.click();
    await expect(passwordRecoveryPage.emailError).toHaveText('Enter your email');
  });

  test('TC_PWD_05: badly formatted email is rejected', async ({ passwordRecoveryPage }) => {
    await passwordRecoveryPage.recover(users.invalidEmailFormat);
    await expect(passwordRecoveryPage.emailError).toHaveText('Wrong email');
  });
});

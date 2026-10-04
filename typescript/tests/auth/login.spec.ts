import { test, expect } from '../../fixtures/pageFixtures';
import { uniqueEmail } from '../../utils/helpers';
import users from '../../../test-data/users.json';

test.describe('Sign In - Positive', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_LOGIN_01: sign in with valid credentials @smoke', async ({ account, loginPage, homePage }) => {
    await loginPage.login(account.email, account.password);
    await expect(homePage.logoutLink).toBeVisible();
    await expect(homePage.accountLink).toHaveText(account.email);
    await expect(homePage.loginLink).toBeHidden();
  });

  test('TC_LOGIN_02: sign in with Remember me checked', async ({ account, loginPage, homePage }) => {
    await loginPage.rememberMe.check();
    await loginPage.login(account.email, account.password);
    await expect(homePage.logoutLink).toBeVisible();
  });

  test('TC_LOGIN_03: sign out after signing in', async ({ account, loginPage, homePage }) => {
    await loginPage.login(account.email, account.password);
    await homePage.logoutLink.click();
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.logoutLink).toBeHidden();
  });
});

test.describe('Sign In - Negative', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_LOGIN_04: unregistered email shows error @smoke', async ({ loginPage, homePage }) => {
    await loginPage.login(uniqueEmail('unregistered'), users.wrongPassword);
    await expect(loginPage.errorSummary).toContainText('Login was unsuccessful');
    await expect(loginPage.errorSummary).toContainText('No customer account found');
    await expect(homePage.logoutLink).toBeHidden();
  });

  test('TC_LOGIN_05: registered email with wrong password shows error', async ({ account, loginPage }) => {
    await loginPage.login(account.email, users.wrongPassword);
    await expect(loginPage.errorSummary).toContainText('The credentials provided are incorrect');
  });

  test('TC_LOGIN_06: registered email with empty password shows error', async ({ account, loginPage }) => {
    await loginPage.login(account.email, '');
    await expect(loginPage.errorSummary).toContainText('The credentials provided are incorrect');
  });

  test('TC_LOGIN_07: empty email and password shows error', async ({ loginPage }) => {
    await loginPage.login('', '');
    await expect(loginPage.errorSummary).toContainText('Login was unsuccessful');
  });

  test('TC_LOGIN_08: invalid email format shows field validation', async ({ page, loginPage }) => {
    await loginPage.login(users.invalidEmailFormat, users.wrongPassword);
    await expect(loginPage.emailFieldError).toHaveText('Please enter a valid email address.');
    await expect(page).toHaveURL(/\/login/);
  });
});

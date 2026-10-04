import { test, expect } from '../../fixtures/pageFixtures';

test.describe('Open URL', () => {
  test('TC_URL_01: home page opens with correct title and URL @smoke', async ({ page, homePage }) => {
    await homePage.goto();
    await expect(page).toHaveTitle('Demo Web Shop');
    await expect(page).toHaveURL('/');
  });

  test('TC_URL_02: header shows logo, Log in and Register links', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.registerLink).toBeVisible();
  });

  test('TC_URL_03: Log in link opens the sign-in page', async ({ page, homePage, loginPage }) => {
    await homePage.goto();
    await homePage.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.heading).toHaveText('Welcome, Please Sign In!');
  });
});

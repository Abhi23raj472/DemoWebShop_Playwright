// @ts-check
/**
 * Feature: Site navigation
 * Covers the top menu categories, the logo, footer links, unknown URLs and pages that need a login.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const products = require('../../../test-data/products.json');

test.describe('Navigation - Positive', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // One test per top-menu category: clicking it opens that category with the matching heading.
  products.categories.forEach((category, i) => {
    test(`TC_NAV_0${i + 1}: top menu opens the "${category.name}" category`, async ({ page, homePage, categoryPage }) => {
      await homePage.openCategory(category.name);
      await expect(page).toHaveURL(new RegExp(`${category.path}$`));
      await expect(categoryPage.title).toHaveText(category.name);
    });
  });

  // The logo always brings the user back to the home page.
  test('TC_NAV_08: logo navigates back to the home page', async ({ page, homePage }) => {
    await homePage.openCategory('Books');
    await homePage.logo.click();
    await expect(page).toHaveURL('/');
  });

  // Footer links open the matching information pages.
  const footerLinks = [
    { text: 'Contact us', path: '/contactus', heading: 'Contact Us' },
    { text: 'Sitemap', path: '/sitemap', heading: 'Sitemap' },
    { text: 'Shipping & Returns', path: '/shipping-returns', heading: 'Shipping & Returns' },
    { text: 'About us', path: '/about-us', heading: 'About Us' },
  ];
  footerLinks.forEach((link, i) => {
    test(`TC_NAV_${9 + i}: footer link "${link.text}" opens its page`, async ({ page, homePage }) => {
      await homePage.footer.getByRole('link', { name: link.text, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${link.path}$`));
      await expect(page.locator('.page-title h1')).toHaveText(link.heading);
    });
  });
});

test.describe('Navigation - Negative', () => {
  // An unknown URL returns HTTP 404 and the store's "Page not found" page.
  test('TC_NAV_13: unknown URL shows the "Page not found" page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found/);
  });

  // Account pages are protected: a guest is sent to the login page instead.
  test('TC_NAV_14: guest opening "My account" is redirected to login', async ({ page, accountPage, loginPage }) => {
    await accountPage.gotoInfo();
    await expect(page).toHaveURL(/\/login/);
    await expect(loginPage.heading).toHaveText('Welcome, Please Sign In!');
  });
});

// @ts-check
const fs = require('fs');
const path = require('path');
const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { SearchPage } = require('../pages/SearchPage');
const { CategoryPage } = require('../pages/CategoryPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { WishlistPage } = require('../pages/WishlistPage');
const { ComparePage } = require('../pages/ComparePage');
const { AccountPage } = require('../pages/AccountPage');
const { ContactUsPage } = require('../pages/ContactUsPage');
const { PasswordRecoveryPage } = require('../pages/PasswordRecoveryPage');
const { ProductReviewPage } = require('../pages/ProductReviewPage');
const { EmailAFriendPage } = require('../pages/EmailAFriendPage');
const { uniqueEmail } = require('../utils/helpers');
const users = require('../../test-data/users.json');

// Written by setup/account.setup.ts, which runs once before the browser projects.
const ACCOUNT_FILE = path.join(__dirname, '..', '..', '.auth', 'account.json');

/**
 * @typedef {Object} TestFixtures
 * @property {HomePage} homePage
 * @property {LoginPage} loginPage
 * @property {RegisterPage} registerPage
 * @property {SearchPage} searchPage
 * @property {CategoryPage} categoryPage
 * @property {ProductPage} productPage
 * @property {CartPage} cartPage
 * @property {CheckoutPage} checkoutPage
 * @property {WishlistPage} wishlistPage
 * @property {ComparePage} comparePage
 * @property {AccountPage} accountPage
 * @property {ContactUsPage} contactUsPage
 * @property {PasswordRecoveryPage} passwordRecoveryPage
 * @property {ProductReviewPage} productReviewPage
 * @property {EmailAFriendPage} emailAFriendPage
 * @property {import('../pages/RegisterPage').NewUser} freshUser
 *   A brand-new account registered for this test only; the test's page is left logged in as it.
 *   Use it for tests that change account data (addresses, password, orders, reviews), so they
 *   never interfere with each other or with the shared `account`.
 */

/**
 * @typedef {Object} WorkerFixtures
 * The registered account shared by all tests (from .env, or created by the setup project).
 * Only use it for tests that don't change the account.
 * @property {{ email: string, password: string }} account
 */

const test = base.test.extend(
  /** @type {import('@playwright/test').Fixtures<TestFixtures, WorkerFixtures, import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions, import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions>} */ ({
    homePage: async ({ page }, use) => use(new HomePage(page)),
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    registerPage: async ({ page }, use) => use(new RegisterPage(page)),
    searchPage: async ({ page }, use) => use(new SearchPage(page)),
    categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
    productPage: async ({ page }, use) => use(new ProductPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
    wishlistPage: async ({ page }, use) => use(new WishlistPage(page)),
    comparePage: async ({ page }, use) => use(new ComparePage(page)),
    accountPage: async ({ page }, use) => use(new AccountPage(page)),
    contactUsPage: async ({ page }, use) => use(new ContactUsPage(page)),
    passwordRecoveryPage: async ({ page }, use) => use(new PasswordRecoveryPage(page)),
    productReviewPage: async ({ page }, use) => use(new ProductReviewPage(page)),
    emailAFriendPage: async ({ page }, use) => use(new EmailAFriendPage(page)),

    freshUser: async ({ registerPage }, use) => {
      const user = { ...users.newUser, email: uniqueEmail('fresh') };
      await registerPage.goto();
      await registerPage.register(user);
      await base.expect(registerPage.result).toContainText('Your registration completed');
      await use(user);
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

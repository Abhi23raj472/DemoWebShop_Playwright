import fs from 'fs';
import path from 'path';
import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage, NewUser } from '../pages/RegisterPage';
import { SearchPage } from '../pages/SearchPage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ComparePage } from '../pages/ComparePage';
import { AccountPage } from '../pages/AccountPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { PasswordRecoveryPage } from '../pages/PasswordRecoveryPage';
import { ProductReviewPage } from '../pages/ProductReviewPage';
import { EmailAFriendPage } from '../pages/EmailAFriendPage';
import { uniqueEmail } from '../utils/helpers';
import { withSteps } from '../utils/steps';
import users from '../../test-data/users.json';

// Written by setup/account.setup.ts, which runs once before the browser projects.
const ACCOUNT_FILE = path.join(__dirname, '..', '..', '.auth', 'account.json');

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  searchPage: SearchPage;
  categoryPage: CategoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  wishlistPage: WishlistPage;
  comparePage: ComparePage;
  accountPage: AccountPage;
  contactUsPage: ContactUsPage;
  passwordRecoveryPage: PasswordRecoveryPage;
  productReviewPage: ProductReviewPage;
  emailAFriendPage: EmailAFriendPage;
};

type Account = { email: string; password: string };

type TestFixtures = Pages & {
  /**
   * A brand-new account registered for this test only; the test's page is left logged in as it.
   * Use it for tests that change account data (addresses, password, orders, reviews), so they
   * never interfere with each other or with the shared `account`.
   */
  freshUser: NewUser;
};

type WorkerFixtures = {
  // The registered account shared by all tests (from .env, or created by the setup project).
  // Only use it for tests that don't change the account.
  account: Account;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  homePage: async ({ page }, use, testInfo) => use(withSteps(new HomePage(page), page, testInfo)),
  loginPage: async ({ page }, use, testInfo) => use(withSteps(new LoginPage(page), page, testInfo)),
  registerPage: async ({ page }, use, testInfo) => use(withSteps(new RegisterPage(page), page, testInfo)),
  searchPage: async ({ page }, use, testInfo) => use(withSteps(new SearchPage(page), page, testInfo)),
  categoryPage: async ({ page }, use, testInfo) => use(withSteps(new CategoryPage(page), page, testInfo)),
  productPage: async ({ page }, use, testInfo) => use(withSteps(new ProductPage(page), page, testInfo)),
  cartPage: async ({ page }, use, testInfo) => use(withSteps(new CartPage(page), page, testInfo)),
  checkoutPage: async ({ page }, use, testInfo) => use(withSteps(new CheckoutPage(page), page, testInfo)),
  wishlistPage: async ({ page }, use, testInfo) => use(withSteps(new WishlistPage(page), page, testInfo)),
  comparePage: async ({ page }, use, testInfo) => use(withSteps(new ComparePage(page), page, testInfo)),
  accountPage: async ({ page }, use, testInfo) => use(withSteps(new AccountPage(page), page, testInfo)),
  contactUsPage: async ({ page }, use, testInfo) => use(withSteps(new ContactUsPage(page), page, testInfo)),
  passwordRecoveryPage: async ({ page }, use, testInfo) => use(withSteps(new PasswordRecoveryPage(page), page, testInfo)),
  productReviewPage: async ({ page }, use, testInfo) => use(withSteps(new ProductReviewPage(page), page, testInfo)),
  emailAFriendPage: async ({ page }, use, testInfo) => use(withSteps(new EmailAFriendPage(page), page, testInfo)),

  freshUser: async ({ registerPage }, use) => {
    const user: NewUser = { ...users.newUser, email: uniqueEmail('fresh') };
    await registerPage.goto();
    await registerPage.register(user);
    await expect(registerPage.result).toContainText('Your registration completed');
    await use(user);
  },

  account: [
    async ({}, use) => {
      await use(JSON.parse(fs.readFileSync(ACCOUNT_FILE, 'utf-8')));
    },
    { scope: 'worker' },
  ],
});

export { expect };

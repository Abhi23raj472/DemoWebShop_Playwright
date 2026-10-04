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

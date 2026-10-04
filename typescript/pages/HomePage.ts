import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.header-logo');
    this.loginLink = page.locator('a.ico-login');
    this.registerLink = page.locator('a.ico-register');
    this.logoutLink = page.locator('a.ico-logout');
    this.accountLink = page.locator('.header-links a.account');
  }

  async goto() {
    await this.open('/');
  }
}

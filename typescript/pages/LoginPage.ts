import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly rememberMe: Locator;
  readonly loginButton: Locator;
  readonly errorSummary: Locator;
  readonly emailFieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.page-title h1');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.rememberMe = page.locator('#RememberMe');
    this.loginButton = page.locator('input.login-button');
    this.errorSummary = page.locator('.validation-summary-errors');
    this.emailFieldError = page.locator('span[data-valmsg-for="Email"]');
  }

  async goto() {
    await this.open('/login');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

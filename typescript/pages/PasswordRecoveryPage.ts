import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Forgot password?" page (/passwordrecovery). */
export class PasswordRecoveryPage extends BasePage {
  readonly email: Locator;
  readonly recoverButton: Locator;
  /** "Email with instructions has been sent to you." or "Email not found." */
  readonly result: Locator;
  readonly emailError: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('#Email');
    this.recoverButton = page.locator('input.password-recovery-button');
    this.result = page.locator('.page-body .result');
    this.emailError = page.locator('span[data-valmsg-for="Email"]');
  }

  async goto() {
    await this.open('/passwordrecovery');
  }

  async recover(email: string) {
    await this.email.fill(email);
    await this.recoverButton.click();
  }
}

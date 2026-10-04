// @ts-check
const { BasePage } = require('./BasePage');

/** "Forgot password?" page (/passwordrecovery). */
class PasswordRecoveryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.email = page.locator('#Email');
    this.recoverButton = page.locator('input.password-recovery-button');
    /** "Email with instructions has been sent to you." or "Email not found." */
    this.result = page.locator('.page-body .result');
    this.emailError = page.locator('span[data-valmsg-for="Email"]');
  }

  async goto() {
    await this.open('/passwordrecovery');
  }

  /** @param {string} email */
  async recover(email) {
    await this.email.fill(email);
    await this.recoverButton.click();
  }
}

module.exports = { PasswordRecoveryPage };

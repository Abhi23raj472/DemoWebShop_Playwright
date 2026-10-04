// @ts-check
const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
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

module.exports = { HomePage };

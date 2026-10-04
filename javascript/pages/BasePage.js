// @ts-check
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async open(path = '/') {
    // Don't wait for the full "load" event: slow third-party resources can stall it (notably in Firefox).
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

module.exports = { BasePage };

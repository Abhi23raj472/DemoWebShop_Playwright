// @ts-check
const { BasePage } = require('./BasePage');

/** Compare products page (/compareproducts). */
class ComparePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageBody = page.locator('.page-body');
    this.table = page.locator('table.compare-products-table');
    this.productNames = page.locator('table.compare-products-table tr.product-name a');
    this.removeButtons = page.locator('table.compare-products-table input.remove-button');
    this.clearListLink = page.locator('a.clear-list');
  }

  async goto() {
    await this.open('/compareproducts');
  }
}

module.exports = { ComparePage };

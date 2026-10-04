// @ts-check
const { BasePage } = require('./BasePage');

/** Search results page (/search?q=...). */
class SearchPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.productTitles = page.locator('.search-results .product-title');
    /** "Search term minimum length is 3 characters". */
    this.warning = page.locator('.search-page .warning');
    /** "No products were found that matched your criteria." */
    this.noResult = page.locator('.search-page .result');
  }

  /** @param {string} term */
  async goto(term) {
    await this.open(`/search?q=${encodeURIComponent(term)}`);
  }
}

module.exports = { SearchPage };

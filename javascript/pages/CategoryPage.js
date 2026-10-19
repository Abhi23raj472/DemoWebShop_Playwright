// @ts-check
const { BasePage } = require('./BasePage');
const { parsePrice } = require('../utils/helpers');

/** Product listing of a category, e.g. /books: sorting, page size, view mode, price filter, pager. */
class CategoryPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.title = page.locator('.page-title h1');
    this.products = page.locator('.product-item');
    this.productTitles = page.locator('.product-item .product-title');
    this.productPrices = page.locator('.product-item .actual-price');
    this.sortBy = page.locator('#products-orderby');
    this.pageSize = page.locator('#products-pagesize');
    this.viewMode = page.locator('#products-viewmode');
    this.listView = page.locator('.product-list');
    this.pager = page.locator('.pager');
    this.priceFilterLinks = page.locator('.price-range-selector a');
  }

  /** @param {string} path */
  async goto(path) {
    await this.open(path);
  }

  /**
   * @param {'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on'} label
   */
  async sort(label) {
    await this.selectAndWait(this.sortBy, label);
  }

  /** @param {'4' | '8' | '12'} size */
  async setPageSize(size) {
    await this.selectAndWait(this.pageSize, size);
  }

  /** @param {'Grid' | 'List'} label */
  async setViewMode(label) {
    await this.selectAndWait(this.viewMode, label);
  }

  /**
   * Clicks the price range link at `index` and waits until the filtered page has loaded.
   * @param {number} index
   */
  async filterByPrice(index) {
    await this.priceFilterLinks.nth(index).click();
    await this.page.waitForURL(/price=/, { waitUntil: 'domcontentloaded' });
  }

  /** Goes to the next page of results and waits until it has loaded. */
  async nextPage() {
    await this.pager.getByRole('link', { name: 'Next' }).click();
    await this.page.waitForURL(/pagenumber=/, { waitUntil: 'domcontentloaded' });
  }

  /**
   * These dropdowns navigate on change: each option's value is the URL to open. Waits for exactly that
   * URL (so a second sort in one test can't match the previous page) and only until the DOM is ready,
   * like BasePage.open.
   * @param {import('@playwright/test').Locator} select
   * @param {string} label
   */
  async selectAndWait(select, label) {
    const target = await select.locator('option', { hasText: label }).first().getAttribute('value');
    const url = new URL(target ?? '', this.page.url()).href;
    await Promise.all([this.page.waitForURL(url, { waitUntil: 'domcontentloaded' }), select.selectOption({ label })]);
  }

  /** @returns {Promise<string[]>} */
  async titles() {
    return (await this.productTitles.allInnerTexts()).map((t) => t.trim());
  }

  /** @returns {Promise<number[]>} */
  async prices() {
    return (await this.productPrices.allInnerTexts()).map(parsePrice);
  }
}

module.exports = { CategoryPage };

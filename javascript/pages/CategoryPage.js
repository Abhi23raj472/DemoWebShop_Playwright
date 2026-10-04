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
   * Selecting an option reloads the page (the site navigates on change).
   * @param {'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on'} label
   */
  async sort(label) {
    await Promise.all([this.page.waitForURL(/orderby=/), this.sortBy.selectOption({ label })]);
  }

  /** @param {'4' | '8' | '12'} size */
  async setPageSize(size) {
    await Promise.all([this.page.waitForURL(/pagesize=/), this.pageSize.selectOption({ label: size })]);
  }

  /** @param {'Grid' | 'List'} label */
  async setViewMode(label) {
    await Promise.all([this.page.waitForURL(/viewmode=/), this.viewMode.selectOption({ label })]);
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

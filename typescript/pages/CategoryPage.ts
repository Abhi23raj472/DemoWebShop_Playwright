import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '../utils/helpers';

/** Product listing of a category, e.g. /books: sorting, page size, view mode, price filter, pager. */
export class CategoryPage extends BasePage {
  readonly title: Locator;
  readonly products: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly sortBy: Locator;
  readonly pageSize: Locator;
  readonly viewMode: Locator;
  readonly listView: Locator;
  readonly pager: Locator;
  readonly priceFilterLinks: Locator;

  constructor(page: Page) {
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

  async goto(path: string) {
    await this.open(path);
  }

  /** Selecting an option reloads the page (the site navigates on change). */
  async sort(label: 'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on') {
    await Promise.all([this.page.waitForURL(/orderby=/), this.sortBy.selectOption({ label })]);
  }

  async setPageSize(size: '4' | '8' | '12') {
    await Promise.all([this.page.waitForURL(/pagesize=/), this.pageSize.selectOption({ label: size })]);
  }

  async setViewMode(label: 'Grid' | 'List') {
    await Promise.all([this.page.waitForURL(/viewmode=/), this.viewMode.selectOption({ label })]);
  }

  async titles(): Promise<string[]> {
    return (await this.productTitles.allInnerTexts()).map((t) => t.trim());
  }

  async prices(): Promise<number[]> {
    return (await this.productPrices.allInnerTexts()).map(parsePrice);
  }
}

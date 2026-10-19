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

  async sort(label: 'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on') {
    await this.selectAndWait(this.sortBy, label);
  }

  async setPageSize(size: '4' | '8' | '12') {
    await this.selectAndWait(this.pageSize, size);
  }

  async setViewMode(label: 'Grid' | 'List') {
    await this.selectAndWait(this.viewMode, label);
  }

  /** Clicks the price range link at `index` and waits until the filtered page has loaded. */
  async filterByPrice(index: number) {
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
   */
  private async selectAndWait(select: Locator, label: string) {
    const target = await select.locator('option', { hasText: label }).first().getAttribute('value');
    const url = new URL(target ?? '', this.page.url()).href;
    await Promise.all([this.page.waitForURL(url, { waitUntil: 'domcontentloaded' }), select.selectOption({ label })]);
  }

  async titles(): Promise<string[]> {
    return (await this.productTitles.allInnerTexts()).map((t) => t.trim());
  }

  async prices(): Promise<number[]> {
    return (await this.productPrices.allInnerTexts()).map(parsePrice);
  }
}

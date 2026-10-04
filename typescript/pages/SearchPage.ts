import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Search results page (/search?q=...). */
export class SearchPage extends BasePage {
  readonly productTitles: Locator;
  /** "Search term minimum length is 3 characters". */
  readonly warning: Locator;
  /** "No products were found that matched your criteria." */
  readonly noResult: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.locator('.search-results .product-title');
    this.warning = page.locator('.search-page .warning');
    this.noResult = page.locator('.search-page .result');
  }

  async goto(term: string) {
    await this.open(`/search?q=${encodeURIComponent(term)}`);
  }
}

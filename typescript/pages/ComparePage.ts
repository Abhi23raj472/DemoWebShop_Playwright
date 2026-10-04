import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Compare products page (/compareproducts). */
export class ComparePage extends BasePage {
  readonly pageBody: Locator;
  readonly table: Locator;
  readonly productNames: Locator;
  readonly removeButtons: Locator;
  readonly clearListLink: Locator;

  constructor(page: Page) {
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

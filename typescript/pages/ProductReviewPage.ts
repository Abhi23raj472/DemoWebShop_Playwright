import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Product reviews page (/productreviews/{productId}): read and write reviews. */
export class ProductReviewPage extends BasePage {
  readonly title: Locator;
  readonly text: Locator;
  readonly submitButton: Locator;
  /** "Product review is successfully added." (div only: existing reviews contain span.result vote counters) */
  readonly result: Locator;
  /** Shown to guests: "Only registered users can write reviews". */
  readonly errorSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('#AddProductReview_Title');
    this.text = page.locator('#AddProductReview_ReviewText');
    this.submitButton = page.locator('input[name="add-review"]');
    this.result = page.locator('.page-body div.result');
    this.errorSummary = page.locator('.page-body .validation-summary-errors');
  }

  async goto(productId: number) {
    await this.open(`/productreviews/${productId}`);
  }

  fieldError(field: 'AddProductReview.Title' | 'AddProductReview.ReviewText'): Locator {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  /** Writes a review with a 1–5 star rating. */
  async submit(review: { title: string; text: string; rating?: 1 | 2 | 3 | 4 | 5 }) {
    await this.title.fill(review.title);
    await this.text.fill(review.text);
    if (review.rating) {
      await this.page.locator(`#addproductrating_${review.rating}`).check();
    }
    await this.submitButton.click();
  }
}

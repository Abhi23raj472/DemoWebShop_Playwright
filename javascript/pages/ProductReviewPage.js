// @ts-check
const { BasePage } = require('./BasePage');

/** Product reviews page (/productreviews/{productId}): read and write reviews. */
class ProductReviewPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.title = page.locator('#AddProductReview_Title');
    this.text = page.locator('#AddProductReview_ReviewText');
    this.submitButton = page.locator('input[name="add-review"]');
    /** "Product review is successfully added." (div only: existing reviews contain span.result vote counters) */
    this.result = page.locator('.page-body div.result');
    /** Shown to guests: "Only registered users can write reviews". */
    this.errorSummary = page.locator('.page-body .validation-summary-errors');
  }

  /** @param {number} productId */
  async goto(productId) {
    await this.open(`/productreviews/${productId}`);
  }

  /** @param {'AddProductReview.Title' | 'AddProductReview.ReviewText'} field */
  fieldError(field) {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  /**
   * Writes a review with a 1–5 star rating.
   * @param {{ title: string, text: string, rating?: 1 | 2 | 3 | 4 | 5 }} review
   */
  async submit(review) {
    await this.title.fill(review.title);
    await this.text.fill(review.text);
    if (review.rating) {
      await this.page.locator(`#addproductrating_${review.rating}`).check();
    }
    await this.submitButton.click();
  }
}

module.exports = { ProductReviewPage };

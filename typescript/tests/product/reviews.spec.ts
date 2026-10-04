/**
 * Feature: Product reviews (/productreviews/{id})
 * Positive: a registered customer submits a review; the "Add your review" link opens the form.
 * Negative: guests can't review; title and text are required.
 * Tests that list `freshUser` are logged in as a newly registered customer.
 */
import { test, expect } from '../../fixtures/pageFixtures';
import products from '../../../test-data/products.json';

const LAPTOP_ID = 31;

test.describe('Product reviews - Positive', () => {
  test('TC_REV_01: registered customer submits a review @smoke', async ({ freshUser, productReviewPage }) => {
    await productReviewPage.goto(LAPTOP_ID);
    await productReviewPage.submit({ title: 'Great laptop', text: `Automated review by ${freshUser.firstName}.`, rating: 4 });
    await expect(productReviewPage.result).toHaveText('Product review is successfully added.');
  });

  // The link on the product page opens that product's review page.
  test('TC_REV_02: "Add your review" link opens the review form', async ({ page, productPage }) => {
    await productPage.goto(products.laptop.slug);
    await productPage.addReviewLink.click();
    await expect(page).toHaveURL(new RegExp(`/productreviews/${LAPTOP_ID}$`));
  });
});

test.describe('Product reviews - Negative', () => {
  test('TC_REV_03: guest is told only registered users can review', async ({ productReviewPage }) => {
    await productReviewPage.goto(LAPTOP_ID);
    await expect(productReviewPage.errorSummary).toContainText('Only registered users can write reviews');
  });

  test('TC_REV_04: review without title and text is rejected', async ({ freshUser, productReviewPage }) => {
    await productReviewPage.goto(LAPTOP_ID);
    await productReviewPage.submitButton.click();
    await expect(productReviewPage.fieldError('AddProductReview.Title')).toHaveText('Review title is required.');
    await expect(productReviewPage.fieldError('AddProductReview.ReviewText')).toHaveText('Review text is required.');
  });
});

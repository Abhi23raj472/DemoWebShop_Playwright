// @ts-check
const { BasePage } = require('./BasePage');

/** Product details page, e.g. /141-inch-laptop. Selectors work for any product. */
class ProductPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.name = page.locator('.product-name h1');
    this.price = page.locator('.product-price').first();
    this.stock = page.locator('.stock .value');
    this.quantity = page.locator('.add-to-cart-panel input.qty-input');
    this.addToCartButton = page.locator('.add-to-cart-panel input.add-to-cart-button');
    this.addToWishlistButton = page.locator('input.add-to-wishlist-button');
    this.addToCompareButton = page.locator('input.add-to-compare-list-button');
    this.emailAFriendButton = page.locator('input.email-a-friend-button');
    this.addReviewLink = page.locator('.product-review-links a', { hasText: 'Add your review' });
    // Gift card fields (only on gift card products; sender fields are required for guests)
    this.recipientName = page.locator('input[id$="_RecipientName"]');
    this.recipientEmail = page.locator('input[id$="_RecipientEmail"]');
    this.senderName = page.locator('input[id$="_SenderName"]');
    this.senderEmail = page.locator('input[id$="_SenderEmail"]');
  }

  /**
   * Opens a product by its URL slug, e.g. "141-inch-laptop".
   * @param {string} slug
   */
  async goto(slug) {
    await this.open(`/${slug}`);
  }

  /**
   * Selects a product option (radio button) by its visible label, e.g. "320 GB".
   * @param {string} label
   */
  async selectOption(label) {
    await this.page.locator('.attributes label', { hasText: label }).click();
  }

  /**
   * Fills the gift card form (recipient and sender).
   * @param {{ recipientName: string, recipientEmail: string, senderName: string, senderEmail: string }} card
   */
  async fillGiftCard(card) {
    await this.recipientName.fill(card.recipientName);
    await this.recipientEmail.fill(card.recipientEmail);
    await this.senderName.fill(card.senderName);
    await this.senderEmail.fill(card.senderEmail);
  }

  /** @param {number | string} [quantity] */
  async addToCart(quantity) {
    if (quantity !== undefined) {
      await this.quantity.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }
}

module.exports = { ProductPage };

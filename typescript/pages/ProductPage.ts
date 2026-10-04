import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Product details page, e.g. /141-inch-laptop. Selectors work for any product. */
export class ProductPage extends BasePage {
  readonly name: Locator;
  readonly price: Locator;
  readonly stock: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;
  readonly addToWishlistButton: Locator;
  readonly addToCompareButton: Locator;
  readonly emailAFriendButton: Locator;
  readonly addReviewLink: Locator;
  // Gift card fields (only on gift card products; sender fields are required for guests)
  readonly recipientName: Locator;
  readonly recipientEmail: Locator;
  readonly senderName: Locator;
  readonly senderEmail: Locator;

  constructor(page: Page) {
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
    this.recipientName = page.locator('input[id$="_RecipientName"]');
    this.recipientEmail = page.locator('input[id$="_RecipientEmail"]');
    this.senderName = page.locator('input[id$="_SenderName"]');
    this.senderEmail = page.locator('input[id$="_SenderEmail"]');
  }

  /** Selects a product option (radio button) by its visible label, e.g. "320 GB". */
  async selectOption(label: string) {
    await this.page.locator('.attributes label', { hasText: label }).click();
  }

  /** Fills the gift card form (recipient and sender). */
  async fillGiftCard(card: { recipientName: string; recipientEmail: string; senderName: string; senderEmail: string }) {
    await this.recipientName.fill(card.recipientName);
    await this.recipientEmail.fill(card.recipientEmail);
    await this.senderName.fill(card.senderName);
    await this.senderEmail.fill(card.senderEmail);
  }

  /** Opens a product by its URL slug, e.g. "141-inch-laptop". */
  async goto(slug: string) {
    await this.open(`/${slug}`);
  }

  async addToCart(quantity?: number | string) {
    if (quantity !== undefined) {
      await this.quantity.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }
}

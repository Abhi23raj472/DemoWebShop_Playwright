// @ts-check
const { BasePage } = require('./BasePage');

/** Wishlist page (/wishlist). */
class WishlistPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageBody = page.locator('.page-body');
    this.productNames = page.locator('.wishlist-content .product a');
    this.addToCartCheckboxes = page.locator('input[name="addtocart"]');
    this.removeCheckboxes = page.locator('input[name="removefromcart"]');
    this.addToCartButton = page.locator('input.wishlist-add-to-cart-button');
    this.updateWishlistButton = page.locator('input.update-wishlist-button');
  }

  async goto() {
    await this.open('/wishlist');
  }

  /**
   * Ticks "Add to cart" for the row at `index` and moves it to the cart.
   * @param {number} [index]
   */
  async moveToCart(index = 0) {
    await this.addToCartCheckboxes.nth(index).check();
    await this.addToCartButton.click();
  }

  /** @param {number} [index] */
  async removeItem(index = 0) {
    await this.removeCheckboxes.nth(index).check();
    await this.updateWishlistButton.click();
  }
}

module.exports = { WishlistPage };

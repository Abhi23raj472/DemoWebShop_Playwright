// @ts-check
const { BasePage } = require('./BasePage');

/** Shopping cart page (/cart). */
class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageBody = page.locator('.page-body');
    this.rows = page.locator('tr.cart-item-row');
    this.productNames = page.locator('tr.cart-item-row .product-name');
    this.unitPrices = page.locator('tr.cart-item-row .product-unit-price');
    this.subtotals = page.locator('tr.cart-item-row .product-subtotal');
    this.quantities = page.locator('tr.cart-item-row input.qty-input');
    this.removeCheckboxes = page.locator('tr.cart-item-row input[name="removefromcart"]');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.termsOfService = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    /** Popup shown when checking out without accepting the terms of service. */
    this.termsWarning = page.locator('#terms-of-service-warning-box');
    this.discountCode = page.locator('input[name="discountcouponcode"]');
    this.applyDiscountButton = page.locator('input[name="applydiscountcouponcode"]');
    this.discountBox = page.locator('.coupon-box');
    this.giftCardCode = page.locator('input[name="giftcardcouponcode"]');
    this.applyGiftCardButton = page.locator('input[name="applygiftcardcouponcode"]');
    this.giftCardBox = page.locator('.giftcard-box');
  }

  async goto() {
    await this.open('/cart');
  }

  /**
   * Sets the quantity of the cart row at `index` and clicks "Update shopping cart".
   * @param {number | string} quantity
   * @param {number} [index]
   */
  async updateQuantity(quantity, index = 0) {
    await this.quantities.nth(index).fill(String(quantity));
    await this.updateCartButton.click();
  }

  /**
   * Ticks "Remove" for the row at `index` and clicks "Update shopping cart".
   * @param {number} [index]
   */
  async removeItem(index = 0) {
    await this.removeCheckboxes.nth(index).check();
    await this.updateCartButton.click();
  }

  /**
   * Accepts the terms of service (unless told not to) and clicks "Checkout".
   * @param {{ acceptTerms?: boolean }} [options]
   */
  async checkout({ acceptTerms = true } = {}) {
    if (acceptTerms) {
      await this.termsOfService.check();
    }
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };

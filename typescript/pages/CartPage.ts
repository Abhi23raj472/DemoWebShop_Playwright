import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Shopping cart page (/cart). */
export class CartPage extends BasePage {
  readonly pageBody: Locator;
  readonly rows: Locator;
  readonly productNames: Locator;
  readonly unitPrices: Locator;
  readonly subtotals: Locator;
  readonly quantities: Locator;
  readonly removeCheckboxes: Locator;
  readonly updateCartButton: Locator;
  readonly termsOfService: Locator;
  readonly checkoutButton: Locator;
  /** Popup shown when checking out without accepting the terms of service. */
  readonly termsWarning: Locator;
  readonly discountCode: Locator;
  readonly applyDiscountButton: Locator;
  readonly discountBox: Locator;
  readonly giftCardCode: Locator;
  readonly applyGiftCardButton: Locator;
  readonly giftCardBox: Locator;

  constructor(page: Page) {
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

  /** Sets the quantity of the cart row at `index` and clicks "Update shopping cart". */
  async updateQuantity(quantity: number | string, index = 0) {
    await this.quantities.nth(index).fill(String(quantity));
    await this.updateCartButton.click();
  }

  /** Ticks "Remove" for the row at `index` and clicks "Update shopping cart". */
  async removeItem(index = 0) {
    await this.removeCheckboxes.nth(index).check();
    await this.updateCartButton.click();
  }

  /** Accepts the terms of service (unless told not to) and clicks "Checkout". */
  async checkout({ acceptTerms = true } = {}) {
    if (acceptTerms) {
      await this.termsOfService.check();
    }
    await this.checkoutButton.click();
  }
}

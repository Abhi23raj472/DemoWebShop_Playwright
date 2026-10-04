// @ts-check
const { BasePage } = require('./BasePage');

/**
 * @typedef {Object} Address
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} country
 * @property {string} city
 * @property {string} address1
 * @property {string} zip
 * @property {string} phone
 */

/**
 * @typedef {Object} CreditCard
 * @property {string} holder
 * @property {string} number
 * @property {string} code
 */

/**
 * Checkout: the "Checkout as Guest" page and the one-page checkout (/onepagecheckout) with its steps
 * Billing address → Shipping address → Shipping method → Payment method → Payment info → Confirm order.
 */
class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.checkoutAsGuestButton = page.locator('input.checkout-as-guest-button');
    // Billing address step
    this.billingAddressSelect = page.locator('#billing-address-select');
    this.billingFirstName = page.locator('#BillingNewAddress_FirstName');
    this.billingLastName = page.locator('#BillingNewAddress_LastName');
    this.billingEmail = page.locator('#BillingNewAddress_Email');
    this.billingCountry = page.locator('#BillingNewAddress_CountryId');
    this.billingCity = page.locator('#BillingNewAddress_City');
    this.billingAddress1 = page.locator('#BillingNewAddress_Address1');
    this.billingZip = page.locator('#BillingNewAddress_ZipPostalCode');
    this.billingPhone = page.locator('#BillingNewAddress_PhoneNumber');
    this.billingContinue = page.locator('#billing-buttons-container input.new-address-next-step-button');
    /** Inline "... is required" messages of the billing form. */
    this.billingErrors = page.locator('#co-billing-form .field-validation-error');
    // Later steps
    this.shippingContinue = page.locator('#shipping-buttons-container input.new-address-next-step-button');
    this.shippingMethodContinue = page.locator('#shipping-method-buttons-container input');
    this.paymentMethodContinue = page.locator('#payment-method-buttons-container input');
    this.paymentInfoContinue = page.locator('#payment-info-buttons-container input');
    this.paymentInfo = page.locator('#checkout-payment-info-load');
    this.paymentErrors = page.locator('#checkout-payment-info-load .validation-summary-errors');
    this.cardholderName = page.locator('#CardholderName');
    this.cardNumber = page.locator('#CardNumber');
    this.expireYear = page.locator('#ExpireYear');
    this.cardCode = page.locator('#CardCode');
    this.confirmButton = page.locator('#confirm-order-buttons-container input.confirm-order-next-step-button');
    // Order completed page
    this.successTitle = page.locator('.order-completed .title');
    this.orderNumber = page.locator('.order-completed .details li').first();
    this.orderDetailsLink = page.locator('.order-completed .details a');
  }

  /**
   * Fills the "new address" billing form and continues.
   * Registered users with saved addresses get a dropdown first, so "New Address" is selected.
   * @param {Address} address
   */
  async fillBillingAddress(address) {
    if (await this.billingAddressSelect.isVisible()) {
      await this.billingAddressSelect.selectOption({ label: 'New Address' });
    }
    await this.billingFirstName.fill(address.firstName);
    await this.billingLastName.fill(address.lastName);
    await this.billingEmail.fill(address.email);
    await this.billingCountry.selectOption({ label: address.country });
    await this.billingCity.fill(address.city);
    await this.billingAddress1.fill(address.address1);
    await this.billingZip.fill(address.zip);
    await this.billingPhone.fill(address.phone);
    await this.billingContinue.click();
  }

  /** Shipping address step: keeps the billing address. */
  async continueShippingAddress() {
    await this.shippingContinue.click();
  }

  /** @param {'Ground' | 'Next Day Air' | '2nd Day Air'} [name] */
  async chooseShippingMethod(name = 'Ground') {
    await this.page.locator('#checkout-shipping-method-load label', { hasText: name }).click();
    await this.shippingMethodContinue.click();
  }

  /** @param {'Cash On Delivery (COD)' | 'Check / Money Order' | 'Credit Card' | 'Purchase Order'} [name] */
  async choosePaymentMethod(name = 'Cash On Delivery (COD)') {
    await this.page.locator('#checkout-payment-method-load label', { hasText: name }).click();
    await this.paymentMethodContinue.click();
  }

  /**
   * Payment information step for credit cards: expiry year is set to next year.
   * @param {CreditCard} card
   */
  async enterCreditCard(card) {
    await this.cardholderName.fill(card.holder);
    await this.cardNumber.fill(card.number);
    await this.expireYear.selectOption({ index: 1 });
    await this.cardCode.fill(card.code);
    await this.paymentInfoContinue.click();
  }

  /**
   * Reads the order number from "Order number: 2394653".
   * @returns {Promise<string>}
   */
  async readOrderNumber() {
    const text = await this.orderNumber.innerText();
    return text.replace(/\D/g, '');
  }
}

module.exports = { CheckoutPage };

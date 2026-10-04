import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type Address = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  address1: string;
  zip: string;
  phone: string;
};

export type CreditCard = {
  holder: string;
  number: string;
  code: string;
};

/**
 * Checkout: the "Checkout as Guest" page and the one-page checkout (/onepagecheckout) with its steps
 * Billing address → Shipping address → Shipping method → Payment method → Payment info → Confirm order.
 */
export class CheckoutPage extends BasePage {
  readonly checkoutAsGuestButton: Locator;
  // Billing address step
  readonly billingAddressSelect: Locator;
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingEmail: Locator;
  readonly billingCountry: Locator;
  readonly billingCity: Locator;
  readonly billingAddress1: Locator;
  readonly billingZip: Locator;
  readonly billingPhone: Locator;
  readonly billingContinue: Locator;
  /** Inline "... is required" messages of the billing form. */
  readonly billingErrors: Locator;
  // Later steps
  readonly shippingContinue: Locator;
  readonly shippingMethodContinue: Locator;
  readonly paymentMethodContinue: Locator;
  readonly paymentInfoContinue: Locator;
  readonly paymentInfo: Locator;
  readonly paymentErrors: Locator;
  readonly cardholderName: Locator;
  readonly cardNumber: Locator;
  readonly expireYear: Locator;
  readonly cardCode: Locator;
  readonly confirmButton: Locator;
  // Order completed page
  readonly successTitle: Locator;
  readonly orderNumber: Locator;
  readonly orderDetailsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutAsGuestButton = page.locator('input.checkout-as-guest-button');
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
    this.billingErrors = page.locator('#co-billing-form .field-validation-error');
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
    this.successTitle = page.locator('.order-completed .title');
    this.orderNumber = page.locator('.order-completed .details li').first();
    this.orderDetailsLink = page.locator('.order-completed .details a');
  }

  /**
   * Fills the "new address" billing form and continues.
   * Registered users with saved addresses get a dropdown first, so "New Address" is selected.
   */
  async fillBillingAddress(address: Address) {
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

  async chooseShippingMethod(name: 'Ground' | 'Next Day Air' | '2nd Day Air' = 'Ground') {
    await this.page.locator('#checkout-shipping-method-load label', { hasText: name }).click();
    await this.shippingMethodContinue.click();
  }

  async choosePaymentMethod(
    name: 'Cash On Delivery (COD)' | 'Check / Money Order' | 'Credit Card' | 'Purchase Order' = 'Cash On Delivery (COD)',
  ) {
    await this.page.locator('#checkout-payment-method-load label', { hasText: name }).click();
    await this.paymentMethodContinue.click();
  }

  /** Payment information step for credit cards: expiry year is set to next year. */
  async enterCreditCard(card: CreditCard) {
    await this.cardholderName.fill(card.holder);
    await this.cardNumber.fill(card.number);
    await this.expireYear.selectOption({ index: 1 });
    await this.cardCode.fill(card.code);
    await this.paymentInfoContinue.click();
  }

  /** Reads the order number from "Order number: 2394653". */
  async readOrderNumber(): Promise<string> {
    const text = await this.orderNumber.innerText();
    return text.replace(/\D/g, '');
  }
}

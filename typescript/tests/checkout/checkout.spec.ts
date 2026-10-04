/**
 * Feature: Checkout – end to end (product → cart → checkout → order confirmation)
 * Positive: guest checkout with different shipping/payment methods, credit card, registered customer.
 * Negative: empty and invalid billing details, invalid credit card, checkout with an empty cart.
 */
import { test, expect } from '../../fixtures/pageFixtures';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ProductPage } from '../../pages/ProductPage';
import { uniqueEmail } from '../../utils/helpers';
import products from '../../../test-data/products.json';
import data from '../../../test-data/checkout.json';

/** Billing address for a guest, with a unique email per order. */
const guestAddress = () => ({ ...data.address, email: uniqueEmail('guest') });

/** Adds the smartphone to the cart and goes to the checkout as a guest (shared by most tests). */
async function startGuestCheckout(productPage: ProductPage, cartPage: CartPage, checkoutPage: CheckoutPage) {
  await test.step('Add product to cart', async () => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('The product has been added to your shopping cart');
  });
  await test.step('Accept terms and check out as guest', async () => {
    await cartPage.goto();
    await cartPage.checkout();
    await checkoutPage.checkoutAsGuestButton.click();
  });
}

test.describe('Checkout - Positive', () => {
  // The full happy path a guest takes: Ground shipping and Cash On Delivery.
  test('TC_CHK_01: guest places an order with Cash On Delivery @smoke @e2e', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);

    await test.step('Billing and shipping address', async () => {
      await checkoutPage.fillBillingAddress(guestAddress());
      await checkoutPage.continueShippingAddress();
    });
    await test.step('Shipping and payment method', async () => {
      await checkoutPage.chooseShippingMethod('Ground');
      await checkoutPage.choosePaymentMethod('Cash On Delivery (COD)');
      await expect(checkoutPage.paymentInfo).toContainText('You will pay by COD');
      await checkoutPage.paymentInfoContinue.click();
    });
    await test.step('Confirm order', async () => {
      await checkoutPage.confirmButton.click();
      await expect(checkoutPage.successTitle).toContainText('Your order has been successfully processed!');
      expect(await checkoutPage.readOrderNumber()).toMatch(/^\d+$/);
    });
  });

  // Other shipping and payment options also complete the order.
  test('TC_CHK_02: guest order with Next Day Air and Check / Money Order @e2e', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.fillBillingAddress(guestAddress());
    await checkoutPage.continueShippingAddress();
    await checkoutPage.chooseShippingMethod('Next Day Air');
    await checkoutPage.choosePaymentMethod('Check / Money Order');
    await checkoutPage.paymentInfoContinue.click();
    await checkoutPage.confirmButton.click();
    await expect(checkoutPage.successTitle).toContainText('Your order has been successfully processed!');
  });

  // A valid test card number (4111 1111 1111 1111) is accepted.
  test('TC_CHK_03: guest pays with a valid credit card @e2e', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.fillBillingAddress(guestAddress());
    await checkoutPage.continueShippingAddress();
    await checkoutPage.chooseShippingMethod('Ground');
    await checkoutPage.choosePaymentMethod('Credit Card');
    await checkoutPage.enterCreditCard({
      holder: data.creditCard.holder,
      number: data.creditCard.validNumber,
      code: data.creditCard.validCode,
    });
    await checkoutPage.confirmButton.click();
    await expect(checkoutPage.successTitle).toContainText('Your order has been successfully processed!');
  });

  // A registered customer orders, and the order then appears under My account → Orders.
  test('TC_CHK_04: registered customer order appears in order history @e2e', async ({
    freshUser,
    productPage,
    cartPage,
    checkoutPage,
    accountPage,
  }) => {
    let orderNumber = '';
    await test.step('Add product and check out (logged in, no guest step)', async () => {
      await productPage.goto(products.book.slug);
      await productPage.addToCart();
      await expect(productPage.notification).toBeVisible();
      await cartPage.goto();
      await cartPage.checkout();
    });
    await test.step('Complete checkout', async () => {
      await checkoutPage.fillBillingAddress({ ...data.address, email: freshUser.email });
      await checkoutPage.continueShippingAddress();
      await checkoutPage.chooseShippingMethod('Ground');
      await checkoutPage.choosePaymentMethod('Cash On Delivery (COD)');
      await checkoutPage.paymentInfoContinue.click();
      await checkoutPage.confirmButton.click();
      await expect(checkoutPage.successTitle).toContainText('Your order has been successfully processed!');
      orderNumber = await checkoutPage.readOrderNumber();
    });
    await test.step('Order is listed in My account → Orders', async () => {
      await accountPage.gotoOrders();
      await expect(accountPage.pageBody).toContainText(orderNumber);
    });
  });
});

test.describe('Checkout - Negative', () => {
  // Continuing with an empty billing form shows every required-field message.
  test('TC_CHK_05: empty billing address shows required-field errors', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.billingContinue.click();

    for (const message of [
      'First name is required.',
      'Last name is required.',
      'Email is required.',
      'Country is required.',
      'City is required',
      'Street address is required',
      'Zip / postal code is required',
      'Phone is required',
    ]) {
      await expect(checkoutPage.billingErrors.filter({ hasText: message })).toBeVisible();
    }
    await expect(checkoutPage.shippingContinue).toBeHidden();
  });

  test('TC_CHK_06: invalid billing email is rejected', async ({ page, productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.billingEmail.fill('not-an-email');
    await checkoutPage.billingContinue.click();
    await expect(page.locator('span[data-valmsg-for="BillingNewAddress.Email"]')).toHaveText('Wrong email');
  });

  // Empty credit card details: name, number and code are all reported.
  test('TC_CHK_07: empty credit card details are rejected', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.fillBillingAddress(guestAddress());
    await checkoutPage.continueShippingAddress();
    await checkoutPage.chooseShippingMethod('Ground');
    await checkoutPage.choosePaymentMethod('Credit Card');
    await checkoutPage.paymentInfoContinue.click();

    await expect(checkoutPage.paymentErrors).toContainText('Enter cardholder name');
    await expect(checkoutPage.paymentErrors).toContainText('Wrong card number');
    await expect(checkoutPage.paymentErrors).toContainText('Wrong card code');
    await expect(checkoutPage.confirmButton).toBeHidden();
  });

  // An invalid card number and a too-short security code are refused.
  test('TC_CHK_08: invalid credit card number is rejected', async ({ productPage, cartPage, checkoutPage }) => {
    await startGuestCheckout(productPage, cartPage, checkoutPage);
    await checkoutPage.fillBillingAddress(guestAddress());
    await checkoutPage.continueShippingAddress();
    await checkoutPage.chooseShippingMethod('Ground');
    await checkoutPage.choosePaymentMethod('Credit Card');
    await checkoutPage.enterCreditCard({
      holder: data.creditCard.holder,
      number: data.creditCard.invalidNumber,
      code: data.creditCard.invalidCode,
    });

    await expect(checkoutPage.paymentErrors).toContainText('Wrong card number');
    await expect(checkoutPage.confirmButton).toBeHidden();
  });

  // Opening the checkout with an empty cart sends the user back to the cart.
  test('TC_CHK_09: checkout with an empty cart redirects to the cart', async ({ page }) => {
    await page.goto('/onepagecheckout', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/cart$/);
  });
});

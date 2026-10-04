// @ts-check
/**
 * Feature: Shopping cart (/cart)
 * Positive: listing, quantity update, multiple products, removal, proceeding to checkout.
 * Negative: checkout without terms, zero quantity, invalid discount and gift card codes.
 * Each test has its own browser session, so every test starts with its own empty guest cart.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { parsePrice } = require('../../utils/helpers');
const products = require('../../../test-data/products.json');

test.describe('Cart - Positive', () => {
  test('TC_CART_01: new visitor sees an empty cart', async ({ cartPage }) => {
    await cartPage.goto();
    await expect(cartPage.pageBody).toContainText('Your Shopping Cart is empty!');
  });

  // The cart row shows the product, its unit price, quantity and subtotal.
  test('TC_CART_02: added product is listed with correct price @smoke', async ({ productPage, cartPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toBeVisible();

    await cartPage.goto();
    await expect(cartPage.productNames).toHaveText([products.smartphone.name]);
    expect(parsePrice(await cartPage.unitPrices.first().innerText())).toBe(products.smartphone.price);
    await expect(cartPage.quantities.first()).toHaveValue('1');
    expect(parsePrice(await cartPage.subtotals.first().innerText())).toBe(products.smartphone.price);
  });

  // Changing the quantity recalculates the subtotal.
  test('TC_CART_03: updating quantity recalculates the subtotal', async ({ productPage, cartPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toBeVisible();

    await cartPage.goto();
    await cartPage.updateQuantity(3);
    await expect(cartPage.quantities.first()).toHaveValue('3');
    expect(parsePrice(await cartPage.subtotals.first().innerText())).toBe(products.smartphone.price * 3);
  });

  // Different products get their own rows.
  test('TC_CART_04: two different products are listed separately', async ({ productPage, cartPage }) => {
    for (const product of [products.smartphone, products.book]) {
      await productPage.goto(product.slug);
      await productPage.addToCart();
      await expect(productPage.notification).toBeVisible();
    }
    await cartPage.goto();
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.productNames).toContainText([products.smartphone.name, products.book.name]);
  });

  // Ticking "Remove" and updating empties the cart.
  test('TC_CART_05: removing the only product empties the cart', async ({ productPage, cartPage, homePage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toBeVisible();

    await cartPage.goto();
    await cartPage.removeItem();
    await expect(cartPage.pageBody).toContainText('Your Shopping Cart is empty!');
    await expect(homePage.cartQuantity).toHaveText('(0)');
  });

  // With the terms accepted, a guest reaches the "Checkout as Guest or Register" page.
  test('TC_CART_06: accepting terms and checking out continues to checkout', async ({ page, productPage, cartPage, checkoutPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toBeVisible();

    await cartPage.goto();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkoutasguest/);
    await expect(checkoutPage.checkoutAsGuestButton).toBeVisible();
  });
});

test.describe('Cart - Negative', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toBeVisible();
  });

  // Checkout is blocked until the terms of service are accepted.
  test('TC_CART_07: checkout without accepting terms shows a warning', async ({ page, cartPage }) => {
    await cartPage.goto();
    await cartPage.checkout({ acceptTerms: false });
    await expect(cartPage.termsWarning).toBeVisible();
    await expect(cartPage.termsWarning).toContainText('Please accept the terms of service before the next step.');
    await expect(page).toHaveURL(/\/cart/);
  });

  // A quantity of 0 removes the product instead of keeping an empty row.
  test('TC_CART_08: quantity 0 removes the product', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.updateQuantity(0);
    await expect(cartPage.pageBody).toContainText('Your Shopping Cart is empty!');
  });

  test('TC_CART_09: invalid discount code is rejected', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.discountCode.fill('INVALID123');
    await cartPage.applyDiscountButton.click();
    await expect(cartPage.discountBox).toContainText("The coupon code you entered couldn't be applied to your order");
  });

  test('TC_CART_10: invalid gift card code is rejected', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.giftCardCode.fill('INVALIDGIFT');
    await cartPage.applyGiftCardButton.click();
    await expect(cartPage.giftCardBox).toContainText("The coupon code you entered couldn't be applied to your order");
  });
});

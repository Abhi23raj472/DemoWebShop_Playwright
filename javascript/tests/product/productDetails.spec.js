// @ts-check
/**
 * Feature: Product details page and "Add to cart"
 * Positive: product information, adding simple, configurable and gift card products.
 * Negative: invalid quantities, missing required options, incomplete gift card details.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { parsePrice } = require('../../utils/helpers');
const products = require('../../../test-data/products.json');

const giftCard = {
  recipientName: 'Friend',
  recipientEmail: 'friend@test.com',
  senderName: 'Tester',
  senderEmail: 'tester@test.com',
};

test.describe('Product details - Positive', () => {
  // The product page shows the name, price and availability.
  test('TC_PROD_01: product page shows name, price and stock', async ({ productPage }) => {
    await productPage.goto(products.laptop.slug);
    await expect(productPage.name).toHaveText(products.laptop.name);
    expect(parsePrice(await productPage.price.innerText())).toBe(products.laptop.price);
    await expect(productPage.stock).toHaveText('In stock');
  });

  // Adding to the cart shows a confirmation and updates the header cart count.
  test('TC_PROD_02: add product to cart @smoke', async ({ productPage, homePage }) => {
    await productPage.goto(products.laptop.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('The product has been added to your shopping cart');
    await expect(homePage.cartQuantity).toHaveText('(1)');
  });

  // The chosen quantity is added in one go.
  test('TC_PROD_03: add product with quantity 3', async ({ productPage, homePage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCart(3);
    await expect(productPage.notification).toContainText('The product has been added to your shopping cart');
    await expect(homePage.cartQuantity).toHaveText('(3)');
  });

  // A configurable product can be added once its required options are chosen.
  test('TC_PROD_04: configurable product with required options is added', async ({ productPage, homePage }) => {
    await productPage.goto(products.configurableComputer.slug);
    await productPage.selectOption('320 GB');
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('The product has been added to your shopping cart');
    await expect(homePage.cartQuantity).toHaveText('(1)');
  });

  // A gift card with recipient and sender details is added.
  test('TC_PROD_05: gift card with recipient and sender is added', async ({ productPage, homePage }) => {
    await productPage.goto(products.giftCard.slug);
    await productPage.fillGiftCard(giftCard);
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('The product has been added to your shopping cart');
    await expect(homePage.cartQuantity).toHaveText('(1)');
  });
});

test.describe('Product details - Negative', () => {
  // Quantities that are zero, negative or not a number are refused and nothing is added.
  for (const quantity of ['0', '-2', 'abc']) {
    test(`TC_PROD_06: quantity "${quantity}" is rejected`, async ({ productPage, homePage }) => {
      await productPage.goto(products.smartphone.slug);
      await productPage.addToCart(quantity);
      await expect(productPage.notification).toContainText('Quantity should be positive');
      await expect(homePage.cartQuantity).toHaveText('(0)');
    });
  }

  // A configurable product can't be added without its required options.
  test('TC_PROD_07: configurable product without required option is rejected', async ({ productPage, homePage }) => {
    await productPage.goto(products.configurableComputer.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('Please select HDD');
    await expect(homePage.cartQuantity).toHaveText('(0)');
  });

  // A gift card needs recipient and sender details.
  test('TC_PROD_08: gift card without details is rejected', async ({ productPage, homePage }) => {
    await productPage.goto(products.giftCard.slug);
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('Enter valid recipient name');
    await expect(productPage.notification).toContainText('Enter valid recipient email');
    await expect(homePage.cartQuantity).toHaveText('(0)');
  });

  // The recipient email must be a valid address.
  test('TC_PROD_09: gift card with invalid recipient email is rejected', async ({ productPage }) => {
    await productPage.goto(products.giftCard.slug);
    await productPage.fillGiftCard({ ...giftCard, recipientEmail: 'not-an-email' });
    await productPage.addToCart();
    await expect(productPage.notification).toContainText('Enter valid recipient email');
  });
});

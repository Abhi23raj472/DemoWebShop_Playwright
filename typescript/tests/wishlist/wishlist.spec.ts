/**
 * Feature: Wishlist (/wishlist)
 * Positive: empty state, adding, moving to cart, removing.
 * Negative: product with required details that are missing.
 */
import { test, expect } from '../../fixtures/pageFixtures';
import products from '../../../test-data/products.json';

test.describe('Wishlist - Positive', () => {
  test('TC_WISH_01: new visitor sees an empty wishlist', async ({ wishlistPage }) => {
    await wishlistPage.goto();
    await expect(wishlistPage.pageBody).toContainText('The wishlist is empty!');
  });

  // Adding shows a confirmation, updates the header count and lists the product.
  test('TC_WISH_02: add product to wishlist @smoke', async ({ productPage, homePage, wishlistPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToWishlistButton.click();
    await expect(productPage.notification).toContainText('The product has been added to your wishlist');
    await expect(homePage.wishlistQuantity).toHaveText('(1)');

    await wishlistPage.goto();
    await expect(wishlistPage.productNames).toHaveText([products.smartphone.name]);
  });

  // "Add to cart" on the wishlist moves the product into the shopping cart.
  test('TC_WISH_03: move product from wishlist to cart', async ({ productPage, wishlistPage, cartPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToWishlistButton.click();
    await expect(productPage.notification).toBeVisible();

    await wishlistPage.goto();
    await wishlistPage.moveToCart();
    await cartPage.goto();
    await expect(cartPage.productNames).toHaveText([products.smartphone.name]);
  });

  test('TC_WISH_04: remove product from wishlist', async ({ productPage, wishlistPage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToWishlistButton.click();
    await expect(productPage.notification).toBeVisible();

    await wishlistPage.goto();
    await wishlistPage.removeItem();
    await expect(wishlistPage.pageBody).toContainText('The wishlist is empty!');
  });
});

test.describe('Wishlist - Negative', () => {
  // A gift card can't be wishlisted without its recipient and sender details.
  test('TC_WISH_05: gift card without details cannot be added', async ({ productPage, homePage }) => {
    await productPage.goto(products.giftCard.slug);
    await productPage.addToWishlistButton.click();
    await expect(productPage.notification).toContainText('Enter valid recipient name');
    await expect(homePage.wishlistQuantity).toHaveText('(0)');
  });
});

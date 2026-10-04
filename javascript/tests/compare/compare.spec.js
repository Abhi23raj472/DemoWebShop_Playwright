// @ts-check
/**
 * Feature: Compare products (/compareproducts)
 * Positive: empty state, comparing two products, removing one, clearing the list.
 * Negative: adding the same product twice does not duplicate it.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const products = require('../../../test-data/products.json');

test.describe('Compare products - Positive', () => {
  test('TC_CMP_01: new visitor has nothing to compare', async ({ comparePage }) => {
    await comparePage.goto();
    await expect(comparePage.pageBody).toContainText('You have no items to compare.');
  });

  // "Add to compare list" on two product pages puts both side by side.
  test('TC_CMP_02: compare two products @smoke', async ({ productPage, comparePage }) => {
    for (const product of [products.smartphone, products.laptop]) {
      await productPage.goto(product.slug);
      await productPage.addToCompareButton.click();
    }
    await expect(comparePage.table).toBeVisible();
    await expect(comparePage.productNames).toHaveCount(2);
    await expect(comparePage.productNames).toContainText([products.laptop.name, products.smartphone.name]);
  });

  test('TC_CMP_03: remove one product from the comparison', async ({ productPage, comparePage }) => {
    for (const product of [products.smartphone, products.laptop]) {
      await productPage.goto(product.slug);
      await productPage.addToCompareButton.click();
    }
    await comparePage.removeButtons.first().click();
    await expect(comparePage.productNames).toHaveCount(1);
  });

  test('TC_CMP_04: clear the comparison list', async ({ productPage, comparePage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCompareButton.click();
    await comparePage.clearListLink.click();
    await expect(comparePage.pageBody).toContainText('You have no items to compare.');
  });
});

test.describe('Compare products - Negative', () => {
  // Adding a product that is already in the list does not create a second column.
  test('TC_CMP_05: same product added twice appears once', async ({ productPage, comparePage }) => {
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCompareButton.click();
    await productPage.goto(products.smartphone.slug);
    await productPage.addToCompareButton.click();
    await expect(comparePage.productNames).toHaveCount(1);
  });
});

// @ts-check
/**
 * Feature: Product search (header search box and /search)
 * Positive: matching results, exact product name, case-insensitivity, Enter key.
 * Negative: term too short, no matches, empty search, special characters.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const products = require('../../../test-data/products.json');

test.describe('Search - Positive', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  // Every result title contains the search term.
  test('TC_SRCH_01: search returns only matching products @smoke', async ({ page, homePage, searchPage }) => {
    await homePage.search('computer');

    await expect(page).toHaveURL(/\/search\?q=computer/);
    await expect(searchPage.productTitles.first()).toBeVisible();
    for (const title of await searchPage.productTitles.allInnerTexts()) {
      expect(title.toLowerCase()).toContain('computer');
    }
  });

  // Searching for an exact product name finds it, and the result opens the product page.
  test('TC_SRCH_02: exact product name is found and opens its page', async ({ homePage, searchPage, productPage }) => {
    await homePage.search(products.smartphone.name);

    await expect(searchPage.productTitles.first()).toHaveText(products.smartphone.name);
    await searchPage.productTitles.first().click();
    await expect(productPage.name).toHaveText(products.smartphone.name);
  });

  // Upper and lower case give the same results.
  test('TC_SRCH_03: search is case-insensitive', async ({ searchPage }) => {
    await searchPage.goto('computer');
    const lower = await searchPage.productTitles.allInnerTexts();
    await searchPage.goto('COMPUTER');
    await expect(searchPage.productTitles).toHaveText(lower);
  });

  // Pressing Enter in the search box submits the search.
  test('TC_SRCH_04: pressing Enter submits the search', async ({ page, homePage }) => {
    await homePage.searchInput.fill('book');
    await homePage.searchInput.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=book/);
  });
});

test.describe('Search - Negative', () => {
  // Terms shorter than 3 characters are not searched.
  test('TC_SRCH_05: term shorter than 3 characters shows a warning', async ({ searchPage }) => {
    await searchPage.goto('ab');
    await expect(searchPage.warning).toHaveText('Search term minimum length is 3 characters');
    await expect(searchPage.productTitles).toHaveCount(0);
  });

  test('TC_SRCH_06: term with no matches shows "No products were found"', async ({ searchPage }) => {
    await searchPage.goto('zzzqqqxxx');
    await expect(searchPage.noResult).toHaveText('No products were found that matched your criteria.');
  });

  // An empty header search shows a browser alert and stays on the page.
  // The alert is handled as it appears: an open alert would otherwise block the click from finishing.
  test('TC_SRCH_07: empty search shows an alert', async ({ page, homePage }) => {
    await homePage.goto();
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });
    await homePage.searchButton.click();
    await expect.poll(() => alertMessage).toBe('Please enter some search keyword');
    await expect(page).toHaveURL('/');
  });

  test('TC_SRCH_08: special characters return no products', async ({ searchPage }) => {
    await searchPage.goto('@#$%^&');
    await expect(searchPage.noResult).toHaveText('No products were found that matched your criteria.');
  });
});

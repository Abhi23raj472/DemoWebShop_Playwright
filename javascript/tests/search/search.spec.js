// @ts-check
const { test, expect } = require('../../fixtures/pageFixtures');

test('search returns matching products @smoke', async ({ page }) => {
  await page.goto('/');
  await page.locator('#small-searchterms').fill('computer');
  await page.locator('input.search-box-button').click();
  await expect(page.locator('.product-item').first()).toBeVisible();
});

/**
 * Feature: Category product listing (uses the Books category)
 * Positive: product grid, sorting, page size, paging, list view, price filter.
 * Negative: page number beyond the last page.
 */
import { test, expect } from '../../fixtures/pageFixtures';
import { isSorted } from '../../utils/helpers';

test.describe('Category listing - Positive', () => {
  test.beforeEach(async ({ categoryPage }) => {
    await categoryPage.goto('/books');
  });

  // Every product in the grid shows a title and a price.
  test('TC_CAT_01: category lists products with title and price @smoke', async ({ categoryPage }) => {
    await expect(categoryPage.title).toHaveText('Books');
    const count = await categoryPage.products.count();
    expect(count).toBeGreaterThan(0);
    await expect(categoryPage.productTitles).toHaveCount(count);
    await expect(categoryPage.productPrices).toHaveCount(count);
  });

  test('TC_CAT_02: sort by name A to Z', async ({ categoryPage }) => {
    await categoryPage.sort('Name: A to Z');
    expect(isSorted(await categoryPage.titles(), 'asc')).toBe(true);
  });

  test('TC_CAT_03: sort by name Z to A', async ({ categoryPage }) => {
    await categoryPage.sort('Name: Z to A');
    expect(isSorted(await categoryPage.titles(), 'desc')).toBe(true);
  });

  test('TC_CAT_04: sort by price low to high', async ({ categoryPage }) => {
    await categoryPage.sort('Price: Low to High');
    expect(isSorted(await categoryPage.prices(), 'asc')).toBe(true);
  });

  test('TC_CAT_05: sort by price high to low', async ({ categoryPage }) => {
    await categoryPage.sort('Price: High to Low');
    expect(isSorted(await categoryPage.prices(), 'desc')).toBe(true);
  });

  // Page size 4 shows at most 4 products and a pager; "Next" shows different products.
  test('TC_CAT_06: page size 4 limits products and enables paging', async ({ page, categoryPage }) => {
    await categoryPage.setPageSize('4');
    await expect(categoryPage.products).toHaveCount(4);
    const firstPage = await categoryPage.titles();

    await categoryPage.pager.getByRole('link', { name: 'Next' }).click();
    await expect(page).toHaveURL(/pagenumber=2/);
    expect(await categoryPage.titles()).not.toEqual(firstPage);
  });

  // List view switches the layout from grid to list.
  test('TC_CAT_07: list view mode shows products as a list', async ({ categoryPage }) => {
    await categoryPage.setViewMode('List');
    await expect(categoryPage.listView).toBeVisible();
  });

  // Price filter: every product shown is inside the selected range.
  // `hasProducts` reflects the store's Books data: no book costs between 25 and 50, so that range is empty.
  const ranges = [
    { index: 0, name: 'Under 25', min: 0, max: 25, hasProducts: true },
    { index: 1, name: '25 - 50', min: 25, max: 50, hasProducts: false },
    { index: 2, name: 'Over 50', min: 50, max: Infinity, hasProducts: true },
  ];
  ranges.forEach((range, i) => {
    test(`TC_CAT_0${8 + i}: price filter "${range.name}" shows only products in range`, async ({ page, categoryPage }) => {
      await categoryPage.priceFilterLinks.nth(range.index).click();
      await expect(page).toHaveURL(/price=/);
      const prices = await categoryPage.prices();
      expect(prices.length > 0).toBe(range.hasProducts);
      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(range.min);
        expect(price).toBeLessThanOrEqual(range.max);
      }
    });
  });
});

test.describe('Category listing - Negative', () => {
  // A page number past the last page shows no products instead of an error.
  test('TC_CAT_11: page number beyond the last page shows no products', async ({ categoryPage }) => {
    await categoryPage.goto('/books?pagenumber=99');
    await expect(categoryPage.title).toHaveText('Books');
    await expect(categoryPage.products).toHaveCount(0);
  });
});

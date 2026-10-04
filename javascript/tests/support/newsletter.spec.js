// @ts-check
/**
 * Feature: Newsletter subscription (box in the left column of the home page)
 * Positive: subscribing with a valid email.
 * Negative: invalid and empty email.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { uniqueEmail } = require('../../utils/helpers');

test.describe('Newsletter - Positive', () => {
  test('TC_NEWS_01: subscribe with a valid email', async ({ homePage }) => {
    await homePage.goto();
    await homePage.subscribeToNewsletter(uniqueEmail('news'));
    await expect(homePage.newsletterResult).toContainText('Thank you for signing up!');
  });
});

test.describe('Newsletter - Negative', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('TC_NEWS_02: invalid email is rejected', async ({ homePage }) => {
    await homePage.subscribeToNewsletter('not-an-email');
    await expect(homePage.newsletterResult).toHaveText('Enter valid email');
  });

  test('TC_NEWS_03: empty email is rejected', async ({ homePage }) => {
    await homePage.newsletterSubscribe.click();
    await expect(homePage.newsletterResult).toHaveText('Enter valid email');
  });
});

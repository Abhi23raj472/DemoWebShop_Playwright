// @ts-check
/**
 * Feature: Email a friend (/productemailafriend/{id})
 * Positive: a registered customer sends a product to a friend.
 * Negative: empty or invalid friend email.
 * Tests that list `freshUser` are logged in as a newly registered customer.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { uniqueEmail } = require('../../utils/helpers');
const products = require('../../../test-data/products.json');

const LAPTOP_ID = 31;

test.describe('Email a friend - Positive', () => {
  test('TC_EAF_01: registered customer emails a product to a friend', async ({ freshUser, emailAFriendPage }) => {
    await emailAFriendPage.goto(LAPTOP_ID);
    // The sender's email is prefilled from the logged-in account.
    await expect(emailAFriendPage.yourEmail).toHaveValue(freshUser.email);
    await emailAFriendPage.send(uniqueEmail('friend'));
    await expect(emailAFriendPage.result).toHaveText('Your message has been sent.');
  });

  // The "Email a friend" button on the product page opens this form.
  test('TC_EAF_02: "Email a friend" button opens the form', async ({ page, productPage }) => {
    await productPage.goto(products.laptop.slug);
    await productPage.emailAFriendButton.click();
    await expect(page).toHaveURL(new RegExp(`/productemailafriend/${LAPTOP_ID}$`));
  });
});

test.describe('Email a friend - Negative', () => {
  test('TC_EAF_03: empty friend email is rejected', async ({ freshUser, emailAFriendPage }) => {
    await emailAFriendPage.goto(LAPTOP_ID);
    await emailAFriendPage.sendButton.click();
    await expect(emailAFriendPage.friendEmailError).toHaveText("Enter friend's email");
  });

  test('TC_EAF_04: invalid friend email is rejected', async ({ freshUser, emailAFriendPage }) => {
    await emailAFriendPage.goto(LAPTOP_ID);
    await emailAFriendPage.send('not-an-email');
    await expect(emailAFriendPage.friendEmailError).toHaveText('Wrong email');
  });
});

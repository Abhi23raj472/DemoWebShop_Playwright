// @ts-check
/**
 * Feature: Contact us (/contactus)
 * Positive: guest and registered customer send an enquiry.
 * Negative: empty form and invalid email.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { uniqueEmail } = require('../../utils/helpers');

test.describe('Contact us - Positive', () => {
  test('TC_CON_01: guest sends an enquiry @smoke', async ({ contactUsPage }) => {
    await contactUsPage.goto();
    await contactUsPage.submit({ fullName: 'Test Guest', email: uniqueEmail('contact'), enquiry: 'Automated test enquiry.' });
    await expect(contactUsPage.result).toHaveText('Your enquiry has been successfully sent to the store owner.');
  });

  // For a logged-in customer, name and email are prefilled; only the enquiry is needed.
  test('TC_CON_02: registered customer sends an enquiry with prefilled details', async ({ freshUser, contactUsPage }) => {
    await contactUsPage.goto();
    await expect(contactUsPage.email).toHaveValue(freshUser.email);
    await contactUsPage.submit({ enquiry: 'Automated test enquiry from a registered customer.' });
    await expect(contactUsPage.result).toHaveText('Your enquiry has been successfully sent to the store owner.');
  });
});

test.describe('Contact us - Negative', () => {
  test.beforeEach(async ({ contactUsPage }) => {
    await contactUsPage.goto();
  });

  test('TC_CON_03: empty form shows all required-field errors', async ({ contactUsPage }) => {
    await contactUsPage.submitButton.click();
    await expect(contactUsPage.fieldError('FullName')).toHaveText('Enter your name');
    await expect(contactUsPage.fieldError('Email')).toHaveText('Enter email');
    await expect(contactUsPage.fieldError('Enquiry')).toHaveText('Enter enquiry');
  });

  test('TC_CON_04: invalid email is rejected', async ({ contactUsPage }) => {
    await contactUsPage.submit({ fullName: 'Test Guest', email: 'not-an-email', enquiry: 'Hello' });
    await expect(contactUsPage.fieldError('Email')).toHaveText('Wrong email');
    await expect(contactUsPage.result).toBeHidden();
  });
});

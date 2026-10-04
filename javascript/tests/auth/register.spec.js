// @ts-check
/**
 * Feature: Customer registration (/register)
 * Positive: successful registration for both genders.
 * Negative: required fields, email format, password rules and duplicate email.
 */
const { test, expect } = require('../../fixtures/pageFixtures');
const { uniqueEmail } = require('../../utils/helpers');
const users = require('../../../test-data/users.json');

test.describe('Registration - Positive', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  // A new customer registers and is logged in straight away.
  test('TC_REG_01: register with valid details @smoke', async ({ registerPage, homePage }) => {
    const email = uniqueEmail('reg');
    await registerPage.register({ ...users.newUser, email, gender: 'male' });

    await expect(registerPage.result).toHaveText('Your registration completed');
    await expect(homePage.accountLink).toHaveText(email);
    await expect(homePage.logoutLink).toBeVisible();
  });

  // Female gender works too, and "Continue" returns to the home page.
  test('TC_REG_02: register as female and continue to the home page', async ({ page, registerPage }) => {
    await registerPage.register({ ...users.newUser, email: uniqueEmail('reg'), gender: 'female' });
    await expect(registerPage.result).toHaveText('Your registration completed');

    await registerPage.continueButton.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Registration - Negative', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  // Submitting an empty form shows a "required" message for every mandatory field.
  test('TC_REG_03: empty form shows all required-field errors', async ({ page, registerPage }) => {
    await registerPage.registerButton.click();

    await expect(registerPage.fieldError('FirstName')).toHaveText('First name is required.');
    await expect(registerPage.fieldError('LastName')).toHaveText('Last name is required.');
    await expect(registerPage.fieldError('Email')).toHaveText('Email is required.');
    await expect(registerPage.fieldError('Password')).toHaveText('Password is required.');
    await expect(registerPage.fieldError('ConfirmPassword')).toHaveText('Password is required.');
    await expect(page).toHaveURL(/\/register/);
  });

  // The email must be a valid address.
  test('TC_REG_04: invalid email format is rejected', async ({ registerPage }) => {
    await registerPage.register({ ...users.newUser, email: users.invalidEmailFormat });
    await expect(registerPage.fieldError('Email')).toHaveText('Wrong email');
  });

  // Passwords need at least 6 characters.
  test('TC_REG_05: password shorter than 6 characters is rejected', async ({ registerPage }) => {
    await registerPage.register({ ...users.newUser, email: uniqueEmail('reg'), password: '12345' });
    await expect(registerPage.fieldError('Password')).toHaveText('The password should have at least 6 characters.');
  });

  // Password and confirmation must match.
  test('TC_REG_06: mismatched confirmation password is rejected', async ({ registerPage }) => {
    await registerPage.register({ ...users.newUser, email: uniqueEmail('reg'), confirmPassword: 'Different@123' });
    await expect(registerPage.fieldError('ConfirmPassword')).toHaveText(
      'The password and confirmation password do not match.'
    );
  });

  // An email address can only be registered once.
  test('TC_REG_07: already registered email is rejected', async ({ account, registerPage }) => {
    await registerPage.register({ ...users.newUser, email: account.email });
    await expect(registerPage.errorSummary).toContainText('The specified email already exists');
  });
});

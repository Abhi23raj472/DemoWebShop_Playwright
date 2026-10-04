// @ts-check
const { BasePage } = require('./BasePage');

/**
 * @typedef {Object} NewUser
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {'male' | 'female'} [gender]
 * @property {string} [confirmPassword]
 */

/** Registration page (/register) and the "Your registration completed" result page. */
class RegisterPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.genderMale = page.locator('#gender-male');
    this.genderFemale = page.locator('#gender-female');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    /** "Your registration completed" message on the result page. */
    this.result = page.locator('.page-body .result');
    this.continueButton = page.locator('input.register-continue-button');
    /** Server-side errors, e.g. "The specified email already exists". */
    this.errorSummary = page.locator('.validation-summary-errors');
  }

  async goto() {
    await this.open('/register');
  }

  /**
   * Inline validation message shown under a field, e.g. fieldError('Email').
   * @param {'FirstName' | 'LastName' | 'Email' | 'Password' | 'ConfirmPassword'} field
   */
  fieldError(field) {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  /** @param {NewUser} user */
  async register(user) {
    if (user.gender === 'female') {
      await this.genderFemale.check();
    } else {
      await this.genderMale.check();
    }
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.confirmPassword ?? user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

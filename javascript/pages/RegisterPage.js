// @ts-check
const { BasePage } = require('./BasePage');

/**
 * @typedef {Object} NewUser
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 */

class RegisterPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.genderMale = page.locator('#gender-male');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.result = page.locator('.page-body .result');
  }

  async goto() {
    await this.open('/register');
  }

  /** @param {NewUser} user */
  async register(user) {
    await this.genderMale.check();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

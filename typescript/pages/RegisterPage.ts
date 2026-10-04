import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class RegisterPage extends BasePage {
  readonly genderMale: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;
  readonly result: Locator;

  constructor(page: Page) {
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

  async register(user: NewUser) {
    await this.genderMale.check();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.password);
    await this.registerButton.click();
  }
}

import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: 'male' | 'female';
  confirmPassword?: string;
};

/** Registration page (/register) and the "Your registration completed" result page. */
export class RegisterPage extends BasePage {
  readonly genderMale: Locator;
  readonly genderFemale: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;
  /** "Your registration completed" message on the result page. */
  readonly result: Locator;
  readonly continueButton: Locator;
  /** Server-side errors, e.g. "The specified email already exists". */
  readonly errorSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.genderMale = page.locator('#gender-male');
    this.genderFemale = page.locator('#gender-female');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.confirmPassword = page.locator('#ConfirmPassword');
    this.registerButton = page.locator('#register-button');
    this.result = page.locator('.page-body .result');
    this.continueButton = page.locator('input.register-continue-button');
    this.errorSummary = page.locator('.validation-summary-errors');
  }

  async goto() {
    await this.open('/register');
  }

  /** Inline validation message shown under a field, e.g. fieldError('Email'). */
  fieldError(field: 'FirstName' | 'LastName' | 'Email' | 'Password' | 'ConfirmPassword'): Locator {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  async register(user: NewUser) {
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

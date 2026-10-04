import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Contact us page (/contactus). */
export class ContactUsPage extends BasePage {
  readonly fullName: Locator;
  readonly email: Locator;
  readonly enquiry: Locator;
  readonly submitButton: Locator;
  /** "Your enquiry has been successfully sent to the store owner." */
  readonly result: Locator;

  constructor(page: Page) {
    super(page);
    this.fullName = page.locator('#FullName');
    this.email = page.locator('#Email');
    this.enquiry = page.locator('#Enquiry');
    this.submitButton = page.locator('input.contact-us-button');
    this.result = page.locator('.page-body .result');
  }

  async goto() {
    await this.open('/contactus');
  }

  fieldError(field: 'FullName' | 'Email' | 'Enquiry'): Locator {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  async submit(details: { fullName?: string; email?: string; enquiry?: string }) {
    if (details.fullName !== undefined) await this.fullName.fill(details.fullName);
    if (details.email !== undefined) await this.email.fill(details.email);
    if (details.enquiry !== undefined) await this.enquiry.fill(details.enquiry);
    await this.submitButton.click();
  }
}

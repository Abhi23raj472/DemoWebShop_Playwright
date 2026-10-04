// @ts-check
const { BasePage } = require('./BasePage');

/** Contact us page (/contactus). */
class ContactUsPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.fullName = page.locator('#FullName');
    this.email = page.locator('#Email');
    this.enquiry = page.locator('#Enquiry');
    this.submitButton = page.locator('input.contact-us-button');
    /** "Your enquiry has been successfully sent to the store owner." */
    this.result = page.locator('.page-body .result');
  }

  async goto() {
    await this.open('/contactus');
  }

  /** @param {'FullName' | 'Email' | 'Enquiry'} field */
  fieldError(field) {
    return this.page.locator(`span[data-valmsg-for="${field}"]`);
  }

  /** @param {{ fullName?: string, email?: string, enquiry?: string }} details */
  async submit(details) {
    if (details.fullName !== undefined) await this.fullName.fill(details.fullName);
    if (details.email !== undefined) await this.email.fill(details.email);
    if (details.enquiry !== undefined) await this.enquiry.fill(details.enquiry);
    await this.submitButton.click();
  }
}

module.exports = { ContactUsPage };

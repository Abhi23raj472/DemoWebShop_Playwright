// @ts-check
const { BasePage } = require('./BasePage');

/** "My account" area: customer info, addresses, change password and orders (/customer/...). */
class AccountPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageBody = page.locator('.page-body');
    this.pageTitle = page.locator('.page-title h1');
    // Customer info
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.saveInfoButton = page.locator('input.save-customer-info-button');
    // Addresses
    this.addressList = page.locator('.address-list');
    this.addNewAddressButton = page.locator('input.add-address-button');
    this.addressFirstName = page.locator('#Address_FirstName');
    this.addressLastName = page.locator('#Address_LastName');
    this.addressEmail = page.locator('#Address_Email');
    this.addressCountry = page.locator('#Address_CountryId');
    this.addressCity = page.locator('#Address_City');
    this.addressLine1 = page.locator('#Address_Address1');
    this.addressZip = page.locator('#Address_ZipPostalCode');
    this.addressPhone = page.locator('#Address_PhoneNumber');
    this.saveAddressButton = page.locator('input.save-address-button');
    this.fieldErrors = page.locator('.field-validation-error');
    // Change password
    this.oldPassword = page.locator('#OldPassword');
    this.newPassword = page.locator('#NewPassword');
    this.confirmNewPassword = page.locator('#ConfirmNewPassword');
    this.changePasswordButton = page.locator('input.change-password-button');
    this.result = page.locator('.page-body .result');
    this.errorSummary = page.locator('.validation-summary-errors');
    // Orders
    this.orders = page.locator('.order-list .order-item');
  }

  async gotoInfo() {
    await this.open('/customer/info');
  }

  async gotoAddresses() {
    await this.open('/customer/addresses');
  }

  async gotoAddAddress() {
    await this.open('/customer/addressadd');
  }

  async gotoChangePassword() {
    await this.open('/customer/changepassword');
  }

  async gotoOrders() {
    await this.open('/customer/orders');
  }

  /** @param {import('./CheckoutPage').Address} address */
  async addAddress(address) {
    await this.addressFirstName.fill(address.firstName);
    await this.addressLastName.fill(address.lastName);
    await this.addressEmail.fill(address.email);
    await this.addressCountry.selectOption({ label: address.country });
    await this.addressCity.fill(address.city);
    await this.addressLine1.fill(address.address1);
    await this.addressZip.fill(address.zip);
    await this.addressPhone.fill(address.phone);
    await this.saveAddressButton.click();
  }

  /**
   * @param {string} oldPassword
   * @param {string} newPassword
   * @param {string} [confirm]
   */
  async changePassword(oldPassword, newPassword, confirm = newPassword) {
    await this.oldPassword.fill(oldPassword);
    await this.newPassword.fill(newPassword);
    await this.confirmNewPassword.fill(confirm);
    await this.changePasswordButton.click();
  }
}

module.exports = { AccountPage };

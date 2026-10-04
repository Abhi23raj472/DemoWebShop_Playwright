import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Address } from './CheckoutPage';

/** "My account" area: customer info, addresses, change password and orders (/customer/...). */
export class AccountPage extends BasePage {
  readonly pageBody: Locator;
  readonly pageTitle: Locator;
  // Customer info
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly saveInfoButton: Locator;
  // Addresses
  readonly addressList: Locator;
  readonly addNewAddressButton: Locator;
  readonly addressFirstName: Locator;
  readonly addressLastName: Locator;
  readonly addressEmail: Locator;
  readonly addressCountry: Locator;
  readonly addressCity: Locator;
  readonly addressLine1: Locator;
  readonly addressZip: Locator;
  readonly addressPhone: Locator;
  readonly saveAddressButton: Locator;
  readonly fieldErrors: Locator;
  // Change password
  readonly oldPassword: Locator;
  readonly newPassword: Locator;
  readonly confirmNewPassword: Locator;
  readonly changePasswordButton: Locator;
  readonly result: Locator;
  readonly errorSummary: Locator;
  // Orders
  readonly orders: Locator;

  constructor(page: Page) {
    super(page);
    this.pageBody = page.locator('.page-body');
    this.pageTitle = page.locator('.page-title h1');
    this.firstName = page.locator('#FirstName');
    this.lastName = page.locator('#LastName');
    this.email = page.locator('#Email');
    this.saveInfoButton = page.locator('input.save-customer-info-button');
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
    this.oldPassword = page.locator('#OldPassword');
    this.newPassword = page.locator('#NewPassword');
    this.confirmNewPassword = page.locator('#ConfirmNewPassword');
    this.changePasswordButton = page.locator('input.change-password-button');
    this.result = page.locator('.page-body .result');
    this.errorSummary = page.locator('.validation-summary-errors');
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

  async addAddress(address: Address) {
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

  async changePassword(oldPassword: string, newPassword: string, confirm = newPassword) {
    await this.oldPassword.fill(oldPassword);
    await this.newPassword.fill(newPassword);
    await this.confirmNewPassword.fill(confirm);
    await this.changePasswordButton.click();
  }
}

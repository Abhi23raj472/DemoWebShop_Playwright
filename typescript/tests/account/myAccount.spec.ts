/**
 * Feature: My account (/customer/...)
 * Positive: view and update customer info, add an address, change password, empty order history.
 * Negative: incomplete address, wrong old password, mismatched or too-short new password,
 *           old password no longer working after a change.
 * Every test uses `freshUser`, a new account registered just for that test, so changes never leak.
 * Requesting `freshUser` is what logs the page in, even in tests that don't read its values.
 */
import { test, expect } from '../../fixtures/pageFixtures';
import data from '../../../test-data/checkout.json';

test.describe('My account - Positive', () => {
  // Customer info shows the details entered at registration.
  test('TC_ACC_01: customer info shows the registration details', async ({ freshUser, accountPage }) => {
    await accountPage.gotoInfo();
    await expect(accountPage.firstName).toHaveValue(freshUser.firstName);
    await expect(accountPage.lastName).toHaveValue(freshUser.lastName);
    await expect(accountPage.email).toHaveValue(freshUser.email);
  });

  // An updated first name is saved and still shown after reloading.
  test('TC_ACC_02: update first name in customer info', async ({ freshUser, page, accountPage }) => {
    await accountPage.gotoInfo();
    await accountPage.firstName.fill('Updated');
    await accountPage.saveInfoButton.click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(accountPage.firstName).toHaveValue('Updated');
    await expect(accountPage.email).toHaveValue(freshUser.email);
  });

  // A new account has no addresses and no orders.
  test('TC_ACC_03: new account has no addresses and no orders', async ({ freshUser, accountPage }) => {
    await accountPage.gotoAddresses();
    await expect(accountPage.pageBody).toContainText('No addresses');
    await accountPage.gotoOrders();
    await expect(accountPage.pageBody).toContainText('No orders');
  });

  // A saved address appears in the address list.
  test('TC_ACC_04: add a new address @smoke', async ({ freshUser, accountPage }) => {
    await accountPage.gotoAddAddress();
    await accountPage.addAddress({ ...data.address, email: freshUser.email });
    await expect(accountPage.addressList).toContainText(`${data.address.firstName} ${data.address.lastName}`);
    await expect(accountPage.addressList).toContainText(data.address.city);
  });

  // After changing the password, the new password works for logging in.
  test('TC_ACC_05: change password and log in with the new one', async ({ freshUser, accountPage, homePage, loginPage }) => {
    const newPassword = 'Changed@123';
    await accountPage.gotoChangePassword();
    await accountPage.changePassword(freshUser.password, newPassword);
    await expect(accountPage.result).toHaveText('Password was changed');

    await homePage.logoutLink.click();
    await loginPage.goto();
    await loginPage.login(freshUser.email, newPassword);
    await expect(homePage.logoutLink).toBeVisible();
  });
});

test.describe('My account - Negative', () => {
  // Saving an empty address form reports the required fields.
  test('TC_ACC_06: empty address form shows required-field errors', async ({ freshUser, accountPage }) => {
    await accountPage.gotoAddAddress();
    await accountPage.saveAddressButton.click();
    await expect(accountPage.fieldErrors.filter({ hasText: 'First name is required.' })).toBeVisible();
    await expect(accountPage.fieldErrors.filter({ hasText: 'City is required' })).toBeVisible();
    await expect(accountPage.fieldErrors).toHaveCount(7);
  });

  test('TC_ACC_07: wrong old password is rejected', async ({ freshUser, accountPage }) => {
    await accountPage.gotoChangePassword();
    await accountPage.changePassword('Wrong@Old1', 'Changed@123');
    await expect(accountPage.errorSummary).toContainText("Old password doesn't match");
  });

  test('TC_ACC_08: mismatched new password confirmation is rejected', async ({ freshUser, page, accountPage }) => {
    await accountPage.gotoChangePassword();
    await accountPage.changePassword(freshUser.password, 'Changed@123', 'Different@123');
    await expect(page.locator('span[data-valmsg-for="ConfirmNewPassword"]')).toHaveText(
      'The new password and confirmation password do not match.',
    );
  });

  test('TC_ACC_09: new password shorter than 6 characters is rejected', async ({ freshUser, page, accountPage }) => {
    await accountPage.gotoChangePassword();
    await accountPage.changePassword(freshUser.password, '12345');
    await expect(page.locator('span[data-valmsg-for="NewPassword"]')).toHaveText(
      'The password should have at least 6 characters.',
    );
  });

  // Once changed, the old password can no longer be used to log in.
  test('TC_ACC_10: old password stops working after a change', async ({ freshUser, accountPage, homePage, loginPage }) => {
    await accountPage.gotoChangePassword();
    await accountPage.changePassword(freshUser.password, 'Changed@123');
    await expect(accountPage.result).toHaveText('Password was changed');

    await homePage.logoutLink.click();
    await loginPage.goto();
    await loginPage.login(freshUser.email, freshUser.password);
    await expect(loginPage.errorSummary).toContainText('The credentials provided are incorrect');
  });
});

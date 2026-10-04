// @ts-check
const { BasePage } = require('./BasePage');

/** "Email a friend" page for a product (/productemailafriend/{productId}). */
class EmailAFriendPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.friendEmail = page.locator('#FriendEmail');
    this.yourEmail = page.locator('#YourEmailAddress');
    this.message = page.locator('#PersonalMessage');
    this.sendButton = page.locator('input.send-email-a-friend-button');
    /** "Your message has been sent." */
    this.result = page.locator('.page-body .result');
    this.friendEmailError = page.locator('span[data-valmsg-for="FriendEmail"]');
  }

  /** @param {number} productId */
  async goto(productId) {
    await this.open(`/productemailafriend/${productId}`);
  }

  /**
   * @param {string} friendEmail
   * @param {string} [message]
   */
  async send(friendEmail, message = 'Have a look at this product.') {
    await this.friendEmail.fill(friendEmail);
    await this.message.fill(message);
    await this.sendButton.click();
  }
}

module.exports = { EmailAFriendPage };

import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** "Email a friend" page for a product (/productemailafriend/{productId}). */
export class EmailAFriendPage extends BasePage {
  readonly friendEmail: Locator;
  readonly yourEmail: Locator;
  readonly message: Locator;
  readonly sendButton: Locator;
  /** "Your message has been sent." */
  readonly result: Locator;
  readonly friendEmailError: Locator;

  constructor(page: Page) {
    super(page);
    this.friendEmail = page.locator('#FriendEmail');
    this.yourEmail = page.locator('#YourEmailAddress');
    this.message = page.locator('#PersonalMessage');
    this.sendButton = page.locator('input.send-email-a-friend-button');
    this.result = page.locator('.page-body .result');
    this.friendEmailError = page.locator('span[data-valmsg-for="FriendEmail"]');
  }

  async goto(productId: number) {
    await this.open(`/productemailafriend/${productId}`);
  }

  async send(friendEmail: string, message = 'Have a look at this product.') {
    await this.friendEmail.fill(friendEmail);
    await this.message.fill(message);
    await this.sendButton.click();
  }
}

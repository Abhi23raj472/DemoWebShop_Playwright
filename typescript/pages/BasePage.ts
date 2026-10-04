import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = '/') {
    // Don't wait for the full "load" event: slow third-party resources can stall it (notably in Firefox).
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

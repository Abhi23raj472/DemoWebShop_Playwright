// @ts-check

/**
 * Parent of all page objects: navigation plus elements shared by every page
 * (the green/red notification bar shown after "Add to cart", "Add to wishlist", etc.).
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    /** Notification bar at the top of the page, e.g. "The product has been added to your shopping cart". */
    this.notification = page.locator('#bar-notification');
  }

  async open(path = '/') {
    // Don't wait for the full "load" event: slow third-party resources can stall it (notably in Firefox).
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Closes the notification bar so it doesn't cover header links. */
  async closeNotification() {
    await this.notification.locator('.close').click();
  }
}

module.exports = { BasePage };

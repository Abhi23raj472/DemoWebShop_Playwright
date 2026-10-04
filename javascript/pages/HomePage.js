// @ts-check
const { BasePage } = require('./BasePage');

/** Home page plus the header, top menu, search box, newsletter box and footer present on every page. */
class HomePage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    // Header
    this.logo = page.locator('.header-logo');
    this.loginLink = page.locator('a.ico-login');
    this.registerLink = page.locator('a.ico-register');
    this.logoutLink = page.locator('a.ico-logout');
    this.accountLink = page.locator('.header-links a.account');
    this.cartLink = page.locator('a.ico-cart').first();
    this.cartQuantity = page.locator('.header-links .cart-qty');
    this.wishlistLink = page.locator('a.ico-wishlist').first();
    this.wishlistQuantity = page.locator('.header-links .wishlist-qty');
    // Search
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
    // Navigation
    this.topMenu = page.locator('ul.top-menu');
    this.footer = page.locator('.footer');
    // Newsletter
    this.newsletterEmail = page.locator('#newsletter-email');
    this.newsletterSubscribe = page.locator('#newsletter-subscribe-button');
    this.newsletterResult = page.locator('#newsletter-result-block');
  }

  async goto() {
    await this.open('/');
  }

  /**
   * Searches using the header search box.
   * @param {string} term
   */
  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /**
   * Opens a category from the top menu by its visible name, e.g. "Books".
   * @param {string} name
   */
  async openCategory(name) {
    await this.topMenu.locator(':scope > li > a', { hasText: name }).click();
  }

  /** @param {string} email */
  async subscribeToNewsletter(email) {
    await this.newsletterEmail.fill(email);
    await this.newsletterSubscribe.click();
  }
}

module.exports = { HomePage };

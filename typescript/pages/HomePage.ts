import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Home page plus the header, top menu, search box, newsletter box and footer present on every page. */
export class HomePage extends BasePage {
  // Header
  readonly logo: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly accountLink: Locator;
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;
  readonly wishlistLink: Locator;
  readonly wishlistQuantity: Locator;
  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  // Navigation
  readonly topMenu: Locator;
  readonly footer: Locator;
  // Newsletter
  readonly newsletterEmail: Locator;
  readonly newsletterSubscribe: Locator;
  readonly newsletterResult: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.header-logo');
    this.loginLink = page.locator('a.ico-login');
    this.registerLink = page.locator('a.ico-register');
    this.logoutLink = page.locator('a.ico-logout');
    this.accountLink = page.locator('.header-links a.account');
    this.cartLink = page.locator('a.ico-cart').first();
    this.cartQuantity = page.locator('.header-links .cart-qty');
    this.wishlistLink = page.locator('a.ico-wishlist').first();
    this.wishlistQuantity = page.locator('.header-links .wishlist-qty');
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
    this.topMenu = page.locator('ul.top-menu');
    this.footer = page.locator('.footer');
    this.newsletterEmail = page.locator('#newsletter-email');
    this.newsletterSubscribe = page.locator('#newsletter-subscribe-button');
    this.newsletterResult = page.locator('#newsletter-result-block');
  }

  async goto() {
    await this.open('/');
  }

  /** Searches using the header search box. */
  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Opens a category from the top menu by its visible name, e.g. "Books". */
  async openCategory(name: string) {
    await this.topMenu.locator(':scope > li > a', { hasText: name }).click();
  }

  async subscribeToNewsletter(email: string) {
    await this.newsletterEmail.fill(email);
    await this.newsletterSubscribe.click();
  }
}

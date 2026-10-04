# Demo Web Shop – Playwright Automation

[![Playwright Tests](https://github.com/Abhi23raj472/DemoWebShop_Playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Abhi23raj472/DemoWebShop_Playwright/actions/workflows/playwright.yml)

End-to-end UI test automation for [Tricentis Demo Web Shop](https://demowebshop.tricentis.com) using **Playwright Test**, written in both **TypeScript** and **JavaScript**, following the **Page Object Model**.

The `typescript/` and `javascript/` folders are two parallel implementations of the same framework and test cases, so either language can be used as a reference.

## Tech stack

- [Playwright Test](https://playwright.dev) – test runner, browsers, assertions, reports
- TypeScript (strict) and JavaScript (type-checked via JSDoc + `// @ts-check`)
- Page Object Model with custom Playwright fixtures
- GitHub Actions – CI on push / pull request and a daily scheduled run
- Browsers: Chromium, Firefox, WebKit

## Project structure

```
├── .github/workflows/playwright.yml   # GitHub Actions pipeline (push, PR, daily schedule, manual run)
├── Jenkinsfile                        # Jenkins pipeline
├── setup/
│   └── account.setup.ts               # Runs first: registers one shared test account
├── typescript/
│   ├── pages/                         # Page Objects, one per page/feature (see below)
│   ├── fixtures/pageFixtures.ts       # Injects page objects, the shared account and `freshUser`
│   ├── utils/helpers.ts               # uniqueEmail(), parsePrice(), isSorted()
│   └── tests/
│       ├── home/                      # openUrl, navigation
│       ├── auth/                      # login, register, passwordRecovery
│       ├── search/                    # search
│       ├── catalog/                   # category listing (sort, page size, view, price filter)
│       ├── product/                   # productDetails, reviews, emailAFriend
│       ├── cart/                      # cart
│       ├── wishlist/                  # wishlist
│       ├── compare/                   # compare products
│       ├── checkout/                  # end-to-end checkout
│       ├── account/                   # My account
│       └── support/                   # contactUs, newsletter
├── javascript/                        # Same structure and test cases as typescript/, in JavaScript
├── test-data/
│   ├── users.json                     # Registration/login data
│   ├── products.json                  # Products and categories used by the tests
│   └── checkout.json                  # Address and credit card test data
├── playwright.config.ts               # Browsers, timeouts, retries, reporters
├── tsconfig.json
├── .env.example                       # Template for optional local credentials
└── package.json
```

**Page objects** (`typescript/pages/` and `javascript/pages/`): `BasePage`, `HomePage` (header, menu, search box, newsletter, footer), `LoginPage`, `RegisterPage`, `PasswordRecoveryPage`, `SearchPage`, `CategoryPage`, `ProductPage`, `ProductReviewPage`, `EmailAFriendPage`, `CartPage`, `WishlistPage`, `ComparePage`, `CheckoutPage`, `AccountPage`, `ContactUsPage`.

**Test isolation:** every test gets its own browser session, so guest features (cart, wishlist, compare) start empty. Tests that change account data use the `freshUser` fixture, which registers a new account just for that test.

## Test cases

121 end-to-end test cases, implemented identically in TypeScript and JavaScript (242 tests per browser).

| Feature | Spec file | Positive | Negative | Total |
|---|---|---|---|---|
| Open URL | `home/openUrl` | 3 | – | 3 |
| Navigation | `home/navigation` | 12 | 2 | 14 |
| Login | `auth/login` | 3 | 5 | 8 |
| Registration | `auth/register` | 2 | 5 | 7 |
| Password recovery | `auth/passwordRecovery` | 2 | 3 | 5 |
| Search | `search/search` | 4 | 4 | 8 |
| Category listing | `catalog/category` | 10 | 1 | 11 |
| Product details | `product/productDetails` | 5 | 6 | 11 |
| Product reviews | `product/reviews` | 2 | 2 | 4 |
| Email a friend | `product/emailAFriend` | 2 | 2 | 4 |
| Shopping cart | `cart/cart` | 6 | 4 | 10 |
| Wishlist | `wishlist/wishlist` | 4 | 1 | 5 |
| Compare products | `compare/compare` | 4 | 1 | 5 |
| Checkout (E2E) | `checkout/checkout` | 4 | 5 | 9 |
| My account | `account/myAccount` | 5 | 5 | 10 |
| Contact us | `support/contactUs` | 2 | 2 | 4 |
| Newsletter | `support/newsletter` | 1 | 2 | 3 |
| **Total** | | **71** | **50** | **121** |

Tags: `@smoke` marks a quick sanity subset (`npm run test:smoke`); `@e2e` marks the full checkout journeys.

<details>
<summary><b>All test cases</b> (click to expand)</summary>

#### Open URL and navigation
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_URL_01 | + | Home page opens with title "Demo Web Shop" |
| TC_URL_02 | + | Header shows logo, Log in and Register links |
| TC_URL_03 | + | "Log in" opens the sign-in page |
| TC_NAV_01–07 | + | Each top-menu category (Books, Computers, Electronics, Apparel & Shoes, Digital downloads, Jewelry, Gift Cards) opens with the right heading |
| TC_NAV_08 | + | Logo returns to the home page |
| TC_NAV_09–12 | + | Footer links Contact us, Sitemap, Shipping & Returns, About us open their pages |
| TC_NAV_13 | − | Unknown URL → HTTP 404 "Page not found" |
| TC_NAV_14 | − | Guest opening My account → redirected to login |

#### Login, registration, password recovery
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_LOGIN_01 | + | Valid credentials → logged in, account email shown |
| TC_LOGIN_02 | + | Valid credentials with "Remember me" → logged in |
| TC_LOGIN_03 | + | Log in then log out → "Log in" link shown again |
| TC_LOGIN_04 | − | Unregistered email → "No customer account found" |
| TC_LOGIN_05 | − | Wrong password → "The credentials provided are incorrect" |
| TC_LOGIN_06 | − | Empty password → "The credentials provided are incorrect" |
| TC_LOGIN_07 | − | Empty email and password → "Login was unsuccessful" |
| TC_LOGIN_08 | − | Invalid email format → "Please enter a valid email address." |
| TC_REG_01 | + | Valid registration → "Your registration completed", logged in |
| TC_REG_02 | + | Female registration, Continue → home page |
| TC_REG_03 | − | Empty form → all required-field messages |
| TC_REG_04 | − | Invalid email → "Wrong email" |
| TC_REG_05 | − | Password under 6 characters → length message |
| TC_REG_06 | − | Confirmation mismatch → "do not match" message |
| TC_REG_07 | − | Already registered email → "The specified email already exists" |
| TC_PWD_01 | + | Registered email → "Email with instructions has been sent to you." |
| TC_PWD_02 | + | "Forgot password?" link opens recovery page |
| TC_PWD_03 | − | Unregistered email → "Email not found." |
| TC_PWD_04 | − | Empty email → "Enter your email" |
| TC_PWD_05 | − | Invalid email → "Wrong email" |

#### Search and catalog
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_SRCH_01 | + | "computer" → only matching products |
| TC_SRCH_02 | + | Exact name "Smartphone" → found, opens product page |
| TC_SRCH_03 | + | Upper/lower case give the same results |
| TC_SRCH_04 | + | Enter key submits the search |
| TC_SRCH_05 | − | Term under 3 characters → minimum length warning |
| TC_SRCH_06 | − | No match → "No products were found…" |
| TC_SRCH_07 | − | Empty search → alert "Please enter some search keyword" |
| TC_SRCH_08 | − | Special characters → no products |
| TC_CAT_01 | + | Books lists products with title and price |
| TC_CAT_02–05 | + | Sort by name A–Z / Z–A and price low–high / high–low is correct |
| TC_CAT_06 | + | Page size 4 → 4 products, "Next" shows other products |
| TC_CAT_07 | + | List view mode |
| TC_CAT_08–10 | + | Price filters Under 25 / 25–50 / Over 50 show only products in range |
| TC_CAT_11 | − | Page number past the last page → no products |

#### Product, reviews, email a friend
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_PROD_01 | + | Product page shows name, price, "In stock" |
| TC_PROD_02 | + | Add to cart → confirmation, header cart (1) |
| TC_PROD_03 | + | Quantity 3 → header cart (3) |
| TC_PROD_04 | + | Configurable computer with required options → added |
| TC_PROD_05 | + | Gift card with recipient/sender → added |
| TC_PROD_06 | − | Quantity 0, −2 or "abc" → "Quantity should be positive" (3 tests) |
| TC_PROD_07 | − | Configurable computer without HDD → "Please select HDD" |
| TC_PROD_08 | − | Gift card without details → recipient name/email errors |
| TC_PROD_09 | − | Gift card with invalid recipient email → error |
| TC_REV_01 | + | Registered customer submits a review → "Product review is successfully added." |
| TC_REV_02 | + | "Add your review" link opens the review form |
| TC_REV_03 | − | Guest → "Only registered users can write reviews" |
| TC_REV_04 | − | Empty title and text → required messages |
| TC_EAF_01 | + | Registered customer emails a friend → "Your message has been sent." |
| TC_EAF_02 | + | "Email a friend" button opens the form |
| TC_EAF_03 | − | Empty friend email → "Enter friend's email" |
| TC_EAF_04 | − | Invalid friend email → "Wrong email" |

#### Cart, wishlist, compare
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_CART_01 | + | New visitor → "Your Shopping Cart is empty!" |
| TC_CART_02 | + | Added product listed with correct unit price, quantity, subtotal |
| TC_CART_03 | + | Quantity 3 → subtotal recalculated |
| TC_CART_04 | + | Two products → two rows |
| TC_CART_05 | + | Remove → cart empty, header (0) |
| TC_CART_06 | + | Accept terms + Checkout → checkout page |
| TC_CART_07 | − | Checkout without terms → terms-of-service warning |
| TC_CART_08 | − | Quantity 0 → product removed |
| TC_CART_09 | − | Invalid discount code → "couldn't be applied" |
| TC_CART_10 | − | Invalid gift card code → "couldn't be applied" |
| TC_WISH_01 | + | New visitor → "The wishlist is empty!" |
| TC_WISH_02 | + | Add to wishlist → confirmation, header (1), listed |
| TC_WISH_03 | + | Move from wishlist to cart |
| TC_WISH_04 | + | Remove from wishlist → empty |
| TC_WISH_05 | − | Gift card without details → not added |
| TC_CMP_01 | + | New visitor → "You have no items to compare." |
| TC_CMP_02 | + | Two products compared side by side |
| TC_CMP_03 | + | Remove one product |
| TC_CMP_04 | + | Clear list → empty |
| TC_CMP_05 | − | Same product added twice → listed once |

#### Checkout (end to end)
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_CHK_01 | + | Guest: product → cart → billing → Ground → Cash On Delivery → confirm → order number |
| TC_CHK_02 | + | Guest: Next Day Air + Check / Money Order → order placed |
| TC_CHK_03 | + | Guest: valid credit card → order placed |
| TC_CHK_04 | + | Registered customer orders → order listed in My account → Orders |
| TC_CHK_05 | − | Empty billing form → 8 required-field messages |
| TC_CHK_06 | − | Invalid billing email → "Wrong email" |
| TC_CHK_07 | − | Empty credit card details → cardholder, number and code errors |
| TC_CHK_08 | − | Invalid card number → "Wrong card number" |
| TC_CHK_09 | − | Checkout with empty cart → redirected to cart |

#### My account, contact us, newsletter
| ID | Type | Scenario → expected result |
|---|---|---|
| TC_ACC_01 | + | Customer info shows registration details |
| TC_ACC_02 | + | Update first name → saved |
| TC_ACC_03 | + | New account → "No addresses", "No orders" |
| TC_ACC_04 | + | Add address → listed |
| TC_ACC_05 | + | Change password → log in with new password |
| TC_ACC_06 | − | Empty address form → 7 required-field messages |
| TC_ACC_07 | − | Wrong old password → "Old password doesn't match" |
| TC_ACC_08 | − | New/confirm mismatch → "do not match" message |
| TC_ACC_09 | − | New password under 6 characters → length message |
| TC_ACC_10 | − | After a change, the old password no longer logs in |
| TC_CON_01 | + | Guest enquiry → "Your enquiry has been successfully sent…" |
| TC_CON_02 | + | Registered customer enquiry with prefilled details |
| TC_CON_03 | − | Empty form → name, email, enquiry required |
| TC_CON_04 | − | Invalid email → "Wrong email" |
| TC_NEWS_01 | + | Valid email → "Thank you for signing up!" |
| TC_NEWS_02 | − | Invalid email → "Enter valid email" |
| TC_NEWS_03 | − | Empty email → "Enter valid email" |

</details>

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or newer
- Git

### Installation

```bash
git clone https://github.com/Abhi23raj472/DemoWebShop_Playwright.git
cd DemoWebShop_Playwright
npm ci
npx playwright install        # downloads Chromium, Firefox and WebKit
```

### Test account

No account setup is needed. Before the tests run, the `setup` project registers a fresh throwaway account on the demo site and shares it with every test.

To use your own **dedicated test account** locally instead, copy `.env.example` to `.env` and fill in `USER_EMAIL` and `USER_PASSWORD`. Never use a personal account (see [Security](#security)).

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | All tests, all browsers |
| `npm run test:ts` | TypeScript tests only |
| `npm run test:js` | JavaScript tests only |
| `npm run test:chromium` | All tests in Chromium only (fastest) |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run test:headed` | Run with a visible browser |
| `npm run typecheck` | Type-check TypeScript and JavaScript |
| `npm run report` | Open the last HTML report |

Useful variations:

```bash
npx playwright test typescript/tests/auth/login.spec.ts --project=chromium   # one file
npx playwright test -g "TC_LOGIN_04"                                       # one test by name
npx playwright test --ui                                                   # interactive UI mode
npx playwright test --debug                                                # step through with the inspector
```

## Configuration

Key settings in [playwright.config.ts](playwright.config.ts):

| Setting | Local | CI | Why |
|---|---|---|---|
| Workers | 2 (Firefox: 1) | 1 per job | The demo site is slow; too many parallel browsers cause timeouts |
| Retries | 1 | 2 | Absorb occasional slowness of the public demo site |
| Test timeout | 90 s | 90 s | |
| Screenshot | on failure | on failure | |
| Trace / video | on first retry | on first retry | |

`BASE_URL` can be overridden through the environment or `.env`.

## CI/CD

The workflow in [.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs:

- **Daily at 02:00 IST** (`30 20 * * *` UTC)
- On every **push** and **pull request** to `main`
- **Manually** from the Actions tab → *Playwright Tests* → *Run workflow*

Chromium, Firefox and WebKit run as three parallel jobs. Each job type-checks the code and runs the tests. A final **Merge report** job then combines the three results into one HTML report.

Artifacts on each run's summary page (kept for 7 days):

- `playwright-report` – the merged HTML report for all browsers (unzip and open `index.html`)
- `test-results-<browser>` – screenshots, traces and videos (failed runs only; view a trace with `npx playwright show-trace trace.zip`)

## Jenkins

The [Jenkinsfile](Jenkinsfile) defines the same pipeline for Jenkins (Windows or Linux agents): checkout → `npm ci` + browser install → type check → tests → reports. It runs alongside GitHub Actions.

- **Schedule:** daily around 10:00 (Jenkins server time), plus **Build with Parameters** to run on demand
- **Parameter `BROWSER`:** `chromium` (default), `all`, `firefox` or `webkit`. All three browsers run 726 tests, which takes over an hour on a laptop agent
- **Reports on each build:** *Playwright Report* (HTML), *Test Result* trend (JUnit, from `reports/junit.xml`), and archived `test-results/` (screenshots, traces, videos) when a build fails

### Requirements

- Jenkins 2.4xx+ on Java 17 or 21, and Node.js 18+ on the agent
- Plugins: **Pipeline**, **Git**, **JUnit** (all in "Install suggested plugins") and **HTML Publisher**
- To display the Playwright report inside Jenkins, start Jenkins with a Content-Security-Policy that allows the report's scripts, for example:

  ```
  -Dhudson.model.DirectoryBrowserSupport.CSP="sandbox allow-scripts; default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' data: blob:; font-src 'self' data:"
  ```

  Only relax the CSP on a Jenkins that untrusted users can't reach.

### Create the job

1. **New Item** → name `DemoWebShop-Playwright` → **Pipeline** → OK
2. **Pipeline** section → Definition: **Pipeline script from SCM** → SCM: **Git**
   - Repository URL: `https://github.com/Abhi23raj472/DemoWebShop_Playwright.git` (public, no credentials needed)
   - Branch: `*/main` · Script Path: `Jenkinsfile`
3. **Save** → **Build Now**. The first build registers the `BROWSER` parameter and the daily schedule; after that, use **Build with Parameters**.

## Adding a new test

1. Create a page object in `typescript/pages/` (and `javascript/pages/`) extending `BasePage`.
2. Register it as a fixture in `fixtures/pageFixtures.ts` / `.js`.
3. Add a spec under `tests/<feature>/` and use the page object through its fixture:

```ts
import { test, expect } from '../../fixtures/pageFixtures';

test('TC_XXX_01: description @smoke', async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.logo).toBeVisible();
});
```

## Security

- **No real credentials in this repo or in CI.** CI always uses a freshly registered throwaway account, and no site credentials are passed to the workflow.
- Playwright traces and reports record typed values (including passwords) and form posts in plain text, and uploaded artifacts are **not** masked by GitHub. That is why personal accounts should never be used, locally or on CI.
- `.env`, `.auth/`, `test-results/` and `playwright-report/` are git-ignored.
- The workflow runs with read-only repository permissions (`contents: read`).

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
├── .github/workflows/playwright.yml   # CI pipeline (push, PR, daily schedule, manual run)
├── setup/
│   └── account.setup.ts               # Runs first: registers one shared test account
├── typescript/
│   ├── pages/                         # Page Objects: BasePage, HomePage, LoginPage, RegisterPage
│   ├── fixtures/pageFixtures.ts       # Injects page objects and the test account into tests
│   ├── utils/helpers.ts               # Helpers, e.g. uniqueEmail()
│   └── tests/
│       ├── home/openUrl.spec.ts       # Open URL test cases
│       ├── auth/login.spec.ts         # Sign In positive + negative test cases
│       ├── search/search.spec.ts      # Product search
│       ├── cart/                      # (placeholder)
│       └── checkout/                  # (placeholder)
├── javascript/                        # Same structure as typescript/, in JavaScript
├── test-data/users.json               # Shared test data
├── playwright.config.ts               # Browsers, timeouts, retries, reporters
├── tsconfig.json
├── .env.example                       # Template for optional local credentials
└── package.json
```

## Test cases

### Open URL

| ID | Scenario | Expected result |
|---|---|---|
| TC_URL_01 | Open the home page | Title is "Demo Web Shop" and URL is the base URL |
| TC_URL_02 | Check the header | Logo, "Log in" and "Register" links are visible |
| TC_URL_03 | Click "Log in" | Sign-in page opens ("Welcome, Please Sign In!") |

### Sign In – Positive

| ID | Scenario | Expected result |
|---|---|---|
| TC_LOGIN_01 | Valid email and password | Logged in: "Log out" link and account email shown |
| TC_LOGIN_02 | Valid credentials with "Remember me" | Logged in |
| TC_LOGIN_03 | Log in, then log out | "Log in" link shown again |

### Sign In – Negative

| ID | Scenario | Expected result |
|---|---|---|
| TC_LOGIN_04 | Unregistered email | "Login was unsuccessful… No customer account found" |
| TC_LOGIN_05 | Registered email, wrong password | "The credentials provided are incorrect" |
| TC_LOGIN_06 | Registered email, empty password | "The credentials provided are incorrect" |
| TC_LOGIN_07 | Empty email and password | "Login was unsuccessful" |
| TC_LOGIN_08 | Invalid email format | "Please enter a valid email address." and stays on login page |

Tests tagged `@smoke` form a quick sanity suite.

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

import { test, Page, TestInfo } from '@playwright/test';

/**
 * Screenshot mode, from the SCREENSHOTS environment variable:
 * - "step":    a screenshot after every page-object action (default on CI and scheduled runs)
 * - "failure": screenshots only when something fails (default for local runs; faster)
 * A failing step always gets a screenshot, whatever the mode.
 */
export type ScreenshotMode = 'step' | 'failure';

export function screenshotMode(): ScreenshotMode {
  const mode = process.env.SCREENSHOTS ?? (process.env.CI ? 'step' : 'failure');
  return mode === 'step' ? 'step' : 'failure';
}

/** "CartPage" + "updateQuantity" → "Cart page → update quantity" */
function stepTitle(className: string, method: string): string {
  const words = (text: string) => text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  const page = words(className);
  return `${page.charAt(0).toUpperCase()}${page.slice(1)} → ${words(method)}`;
}

/** Attaches a JPEG screenshot of the current page to the running step (best effort). */
async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  try {
    const body = await page.screenshot({ type: 'jpeg', quality: 60 });
    await testInfo.attach(name, { body, contentType: 'image/jpeg' });
  } catch {
    // The page may be closed or blocked by a dialog; a missing screenshot must never fail a test.
  }
}

/**
 * Wraps a page object so every async method call becomes a named report step,
 * e.g. "Cart page → checkout", with a screenshot attached to it.
 * Arguments are left out of step titles on purpose: they can contain passwords.
 * Synchronous members (locators, fieldError()) are returned unchanged.
 */
export function withSteps<T extends object>(pageObject: T, page: Page, testInfo: TestInfo): T {
  const className = pageObject.constructor.name;
  return new Proxy(pageObject, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (typeof value !== 'function' || value.constructor.name !== 'AsyncFunction') {
        return value;
      }
      const title = stepTitle(className, String(property));
      return (...args: unknown[]) =>
        test.step(title, async () => {
          try {
            const result = await value.apply(target, args);
            if (screenshotMode() === 'step') {
              // Let the page settle (AJAX updates, notifications) so the screenshot shows the result of the action.
              await page.waitForLoadState('networkidle', { timeout: 1500 }).catch(() => {});
              await attachScreenshot(page, testInfo, title);
            }
            return result;
          } catch (error) {
            await attachScreenshot(page, testInfo, `FAILED: ${title}`);
            throw error;
          }
        });
    },
  });
}

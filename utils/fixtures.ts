import { test as base } from "@playwright/test";
import { LoginPage } from "page-objects/login.page";
import { Common } from "utils/common";
import { HomePage } from "page-objects/home.page";
import { expect as baseExpect } from "@playwright/test";
import type { Locator } from "@playwright/test";
import { CartPage } from "page-objects/cart.page";
import { CheckOutPage } from "page-objects/checkOut.page";
import { ShopPage } from "page-objects/shop.page";
import fs from "fs";
import path from "path";

export const test = base.extend<{
  loggedInPage: void;
  homePage: HomePage;
  cartPage: CartPage;
  checkOutPage: CheckOutPage;
  shopPage: ShopPage;
}>({
  // Override context so each worker can load a worker-specific storageState file
  context: async ({ browser }, use, workerInfo) => {
    // Pick a random storageState file from env/storageState-*.json for this worker.
    const idx = typeof workerInfo?.workerIndex === "number" ? workerInfo.workerIndex : 0;
    const storageDir = path.join(process.cwd(), "env");
    const candidates = fs.existsSync(storageDir)
      ? fs.readdirSync(storageDir).filter((f) => f.startsWith("storageState") && f.endsWith(".json"))
      : [];

    if (candidates.length > 0) {
      // Choose randomly (per worker) so different workers likely get different accounts.
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const storagePath = path.join(storageDir, chosen);
      console.log(`Worker ${idx} -> randomly selected storage file: ${storagePath}`);
      const context = await browser.newContext({ storageState: storagePath });
      await use(context);
      await context.close();
      return;
    }

    // Fallback to a fresh context if no storage files present
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
  loggedInPage: async ({ page }, use, workerInfo) => {
    // If there are per-worker storageState files (storageState-1.json..), pick one
    const storageDir = path.join(process.cwd(), "env");
    const files = fs.existsSync(storageDir)
      ? fs.readdirSync(storageDir).filter((f) => f.startsWith("storageState") && f.endsWith(".json"))
      : [];

    if (files.length > 0) {
      const idx = typeof workerInfo?.workerIndex === "number" ? workerInfo.workerIndex : 0;
      const fileToUse = files[idx % files.length];
      const storagePath = path.join(storageDir, fileToUse);
      console.log(`loggedInPage: worker ${idx} will use storage file: ${storagePath}`);
      if (fs.existsSync(storagePath)) {
        await Common.navigateToPage(page);
        await use();
        return;
      }
    }

    // Fallback: if no storage state files, perform login as before
    const loginPage = new LoginPage(page);
    await Common.navigateToPage(page);
    await loginPage.logIn(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
    await use();
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkOutPage: async ({ page }, use) => {
    await use(new CheckOutPage(page));
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
});

export const expect = baseExpect.extend({
  async toHaveAmount(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = "toHaveAmount";
    let pass: boolean;
    let matcherResult: any;
    try {
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toHaveAttribute("data-amount", String(expected), options);
      pass = true;
    } catch (e: any) {
      matcherResult = e.matcherResult;
      pass = false;
    }

    if (this.isNot) {
      pass = !pass;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : "")
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : "");

    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },

  async toHaveAmountGreaterThanOrEqual(locator: Locator, expected: number, options?: { timeout?: number }) {
    const assertionName = "toHaveAmountGreaterThanOrEqual";
    const timeout = options?.timeout ?? 5000;
    let pass = false;
    let matcherResult: { actual?: number } | undefined;

    try {
      await locator
        .first()
        .waitFor({ state: "visible", timeout })
        .catch(() => {});
      const raw = await locator.first().evaluate((el) => {
        if (el instanceof HTMLInputElement || (el as HTMLInputElement).value !== undefined) {
          return (el as HTMLInputElement).value || el.textContent || "";
        }
        return el.textContent || "";
      });
      const matched = String(raw).match(/-?\d+(\.\d+)?/);
      const actual = matched ? parseFloat(matched[0]) : NaN;
      const actualValue = Number.isNaN(actual) ? await locator.count() : actual;

      matcherResult = { actual: actualValue };
      pass = actualValue >= expected;
    } catch (e: any) {
      matcherResult = { actual: undefined };
      pass = false;
    }

    if (this.isNot) pass = !pass;

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : "")
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : "");

    return { pass, message };
  },

  async toBeVisibleAfterReloadPage(locator: Locator, options?: { timeout?: number }) {
    const assertionName = "toBeVisibleAfterReloadPage";
    const timeout = options?.timeout ?? 5000;
    let pass = false;
    try {
      await locator.page().reload();
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toBeVisible({ timeout });
      pass = true;
    } catch (e: any) {
      pass = false;
    }
    if (this.isNot) {
      pass = !pass;
    }
    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: not to be visible after reload\n`
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: to be visible after reload\n`;
    return { message, pass, name: assertionName, expected: "to be visible after reload" };
  },
});

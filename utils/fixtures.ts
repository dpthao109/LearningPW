import { test as base } from "@playwright/test";
import { LoginPage } from "page-objects/login.page";
import { Common } from "utils/common";
import { HomePage } from "page-objects/home.page";

export const test = base.extend<{
  loggedInPage: void;
  homePage: HomePage;
}>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await Common.navigateToPage(page);
    await loginPage.logIn(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
    await use();
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
export { expect } from "@playwright/test";

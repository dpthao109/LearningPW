import { test as base } from "@playwright/test";
// import { CONFIG } from "utils/config";
import { LoginPage } from "page-objects/login.page";
import { Common } from "utils/common";
import { HomePage } from "page-objects/home.page";
import { log } from "console";
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

export const test = base.extend<{
  loggedInPage: void;
  homePage: HomePage;
}>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await Common.navigateToPage(page);
    log("USERNAME : " + process.env.TEST_USERNAME!);
    await loginPage.logIn(
      process.env.TEST_USERNAME!,
      process.env.TEST_PASSWORD!
    );
    await use();
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});
export { expect } from "@playwright/test";



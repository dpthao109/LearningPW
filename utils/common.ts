import { Page, expect } from "@playwright/test";
import { CONFIG } from "./config";

export class Common {
  
  static async navigateToPage(page: Page) {
    await page.goto(CONFIG.Url);
    await page.getByRole("button", { name: "Close" }).click();
    await page
      .getByRole("dialog", { name: "Cookie Notice" })
      .getByRole("link", { name: "OK" })
      .click();
  }

  static async randomNumber(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

import { Page, expect, Locator } from "@playwright/test";
import { CONFIG } from "./config";

export class Common {
  page: any;
  static page: any;
  static async navigateToPage(page: Page) {
    await page.goto("");
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("dialog", { name: "Cookie Notice" }).getByRole("link", { name: "OK" }).click();
  }

  static async randomNumber(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  
}

import { Page, expect, Locator } from "@playwright/test";
import { CONFIG } from "./config";

export class Common {
  page: any;
  static page: any;
  static async navigateToPage(page: Page) {
    await page.goto("");
    // await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("dialog", { name: "Cookie Notice" }).getByRole("link", { name: "OK" }).click();
  }

  static async randomNumber(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static async extractPriceValues(prices: string[]): Promise<number[]> {
    return prices.map((priceText) => {
      const match = priceText.match(/[\d,.]+/g);
      if (match) {
        // Handle cases with sale prices (e.g., "$20.00 $15.00")
        const lastPrice = match[match.length - 1];
        return parseFloat(lastPrice.replace(/,/g, ""));
      }
      return 0;
    });
  }

  static async sortNumbersAscending(numbers: number[]): Promise<number[]> {
    return [...numbers].sort((a, b) => a - b);
  }

  static async sortNumbersDescending(numbers: number[]): Promise<number[]> {
    return [...numbers].sort((a, b) => b - a);
  }
  





  
}

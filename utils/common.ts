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

  /**
   * Extracts numeric price values from an array of price strings.
   * @param prices - An array of price strings to parse (e.g., "$20.00", "$20.00 $15.00")
   * @returns A promise that resolves to an array of numeric price values
   * @remarks
   * - Extracts all numeric sequences (digits, commas, and decimal points) from each price string
   * - For prices with multiple values (e.g., sale prices), returns the last numeric value
   * - Returns 0 if no numeric value is found in a price string
   * - Removes commas from extracted values before converting to float
   * @example
   * const prices = ["$20.00", "$30.50 $25.00"];
   * const result = await extractPriceValues(prices);
   * // Returns: [20, 25]
   */
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

  /**
   * Sorts an array of numbers in descending order.
   *
   * @param numbers - The array of numbers to sort.
   * @returns A promise that resolves to a new array containing the sorted numbers in descending order.
   */
  static async sortNumbersDescending(numbers: number[]): Promise<number[]> {
    return [...numbers].sort((a, b) => b - a);
  }
}

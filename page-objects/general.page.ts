import { Locator, Page, expect } from "@playwright/test";
import { time } from "console";
import { TIMEOUT } from "dns";

export class GeneralPage {
  constructor(private page: Page) {}
  loadingLocator: Locator = this.page.locator(".loading");

  async waitForLoadingToComplete() {
    await this.loadingLocator.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
    await expect(this.loadingLocator).toHaveCount(0);
  }

  /**
   * Returns the zero-based index of a column header that exactly matches the provided name.
   *
   * Uses the provided Playwright Locator to retrieve all header text contents and then
   * searches for an exact (case-sensitive) match of `headerName`.
   *
   * @remarks
   * - The search is performed using Array#indexOf on the text contents, so it requires an exact match.
   * - If no header matches `headerName`, the method resolves to -1.
   * - If the underlying Locator operation fails (e.g., due to a detached element), the returned Promise may reject.
   *
   * @param locator - The header row locator
   * @param headerName - The exact header text to find (case-sensitive).
   * @returns A Promise that resolves to the zero-based index of the matching header, or -1 if not found.
   *
   * @example
   * // Find the index of the "Status" column
   * const index = await pageObject.getColumnIndex(headerLocator, "Status");
   */
  async getColumnIndex(locator: Locator, headerName: string): Promise<number> {
    const headers = await locator.allTextContents();
    const headerIndex = headers.indexOf(headerName);
    return headerIndex;
  }

  async getRowIndex(tableLocator: Locator, text: string) {
    const rows = tableLocator.getByRole("row");
    expect (rows.first()).toBeVisible;
    const rowCount = await rows.count();
    if (rowCount === 0) {
      return -1;
    }
    for (let i = 0; i < rowCount; i++) {
      const textContent = await rows.nth(i).getByRole("cell").nth(1).locator(".product-title").textContent();
      if (textContent === text) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Retrieves the text content of a specific cell in a table.
   * @param tableLocator - The locator pointing to the table element
   * @param row - The zero-based index of the row containing the target cell
   * @param column - The zero-based index of the column containing the target cell
   * @returns A promise that resolves to the text content of the cell, or null if the cell is empty
   */
  async getTableCellValue(tableLocator: Locator, row: number, column: number) {
    const cellLocator = tableLocator.getByRole("row").nth(row).getByRole("cell").nth(column);
    const cellText = await cellLocator.textContent();
    return cellText;
  }
}

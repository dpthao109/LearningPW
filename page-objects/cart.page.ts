import { Locator, Page } from "@playwright/test";
import { Common } from "utils/common";
import { GeneralPage } from "./general.page";
import {expect} from "utils/fixtures";

export class CartPage {
  checkoutButton: Locator = this.page.getByRole("link", { name: "PROCEED TO CHECKOUT" });
  removeLink: Locator = this.page.getByRole("link", { name: "Remove" });
  productsTable: Locator = this.page.locator(".woocommerce-cart-form__contents tbody");

  rowItemLocator = (itemName: string): Locator => this.page.getByRole("row").filter({ hasText: itemName });

  constructor(private page: Page) {}
  generalPage = new GeneralPage(this.page);

  async verifyItemInCart(itemName: string, numberOfItems?: number) {
    await this.generalPage.waitForLoadingToComplete();
    const itemInCart = this.page
      .getByRole("link", {
        name: itemName,
      })
      .first();
    await expect(itemInCart).toBeVisibleAfterReloadPage();
    if (numberOfItems) {
      const quantityLocator = this.rowItemLocator(itemName).getByRole("spinbutton");
      await expect(quantityLocator).toHaveValue(numberOfItems.toString());
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async removeItem(itemName: string) {
    const removeButton = this.page
      .getByRole("cell")
      .filter({
        hasText: itemName,
      })
      .getByRole("link", {
        name: "Remove",
      });
    await removeButton.click();
  }

  async removeAllCart() {
    while ((await this.removeLink.count()) > 0) {
      await this.removeLink.first().click();
      await this.page.waitForLoadState("networkidle");
    }
  }

  async verifyCartIsEmpty() {
    await expect(
      this.page.getByRole("heading", {
        name: "YOUR SHOPPING CART IS EMPTY",
      }),
    ).toBeVisible();
  }

  async updateItemQuantity(itemName: string, quantity: number) {
    const quantityLocator = this.rowItemLocator(itemName).getByRole("spinbutton");
    await quantityLocator.fill(quantity.toString());
    // Click outside to trigger update
    await this.page.click("body");
  }

  async getItemQuantity(itemName: string): Promise<number> {
    const quantityLocator = this.rowItemLocator(itemName).getByRole("spinbutton");
    const value = await quantityLocator.inputValue();
    return parseInt(value, 10);
  }

  async addItemQuantity(itemName: string, incrementBy: number) {
    for (let i = 0; i < incrementBy; i++) {
      await this.rowItemLocator(itemName).locator(".plus").click();
    }
  }

  async subtractItemQuantity(itemName: string, decrementBy: number) {
    for (let i = 0; i < decrementBy; i++) {
      await this.rowItemLocator(itemName).locator(".minus").click();
      await this.page.waitForLoadState("networkidle");
    }
  }

  /**
   * Retrieve the numeric price for a product row identified by its visible name.
   *
   * This asynchronous method locates the row for the provided `itemName`, selects
   * the nested element matching the ".product-price" selector, reads its text
   * content, strips any characters except digits, decimal points, and minus
   * signs, and parses the result as a floating-point number.
   *
   * @param itemName - The visible name of the product whose price should be read.
   * @returns A promise that resolves to the product price as a number. If the price
   * text is missing or cannot be parsed, the result will be NaN.
   */
  async getPrice(itemName: string): Promise<number> {
    const priceText = await this.rowItemLocator(itemName).locator(".product-price").textContent();
    return parseFloat((priceText ?? "").replace(/[^\d.-]/g, ""));
  }

  async verifySubTotal(itemName: string, subTotal: number) {
    const expected = (await Common.formatNumber(subTotal)).toString();
    const subTotalLocator = this.rowItemLocator(itemName).locator(".product-subtotal");
    await expect(subTotalLocator).toHaveText(`$${expected}.00`, { timeout: 10000 });
  }

  async getProductDetails(productName: string, columnName:string) {
    const headerCellLocator: Locator = this.page
      .locator(".woocommerce-cart-form__contents thead")
      .getByRole("row")
      .getByRole("cell");
    const rowIndex = await this.generalPage.getRowIndex(this.productsTable, productName);
    const colIndex = await this.generalPage.getColumnIndex(headerCellLocator, columnName) + 1;
    //return this.generalPage.getTableCellValue(this.productsTable, rowIndex, colIndex + 1);

    if (columnName==="Quantity") {
      const cellLocator = this.productsTable.getByRole("row").nth(rowIndex).getByRole("cell").nth(colIndex).getByRole("spinbutton");
      const cellText = await cellLocator.getAttribute("value");
      return cellText;
    } else {
      return this.generalPage.getTableCellValue(this.productsTable, rowIndex, colIndex);
    }
  }

   
}

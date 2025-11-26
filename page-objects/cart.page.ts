import { expect, Locator, Page } from "@playwright/test";
import { log } from "console";

export class CartPage {
  checkoutButton: Locator = this.page.getByRole("link", { name: "PROCEED TO CHECKOUT" });
  removeLink: Locator = this.page.getByRole("link", { name: "Remove" });

  productsTable: Locator = this.page.locator(".woocommerce-cart-form__contents tbody");

  rowItemLocator = (itemName: string): Locator => this.page.getByRole("row").filter({ hasText: itemName });

  constructor(private page: Page) {}

  async verifyItemInCart(itemName: string, numberOfItems?: number) {
    const itemInCart = this.page
      .getByRole("link", {
        name: itemName,
      })
      .first();
    await expect(itemInCart).toBeVisible();
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

  async getPrice(itemName: string): Promise<number> {
    const priceText = await this.rowItemLocator(itemName).locator(".product-price").textContent();
    return parseFloat((priceText ?? "").replace(/[^\d.-]/g, ""));
  }

  async verifySubTotal(itemName: string, expectedTotal: number) {
    const expected = expectedTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const subTotalLocator = this.rowItemLocator(itemName).locator(".product-subtotal");
    await expect(subTotalLocator).toHaveText(`$${expected}.00`, { timeout: 10000 });
  }

  async getRowIndex(text: string) {
    const rows = this.productsTable.getByRole("row");
    await this.page.waitForLoadState();
    const rowCount = await rows.count();
    log("Total Rows :" + rowCount);
    if (rowCount === 0) {
      return -1;
    }
    for (let i = 0; i < rowCount; i++) {
      const textContent = await rows.nth(i).getByRole("cell").nth(1).locator(".product-title").textContent();
      console.log(`Row ${i} Text Content: ${textContent}`);
      if (textContent === text) {
        return i;
      }
    }
    return -1;
  }

  async getColumnIndex(headername: string) {
    const header = this.page.locator(".woocommerce-cart-form__contents thead").getByRole("row")
      .getByRole("columnheader");
    log("header : " + header);
    return header;
  }

  async getTableCellValue() {}
}

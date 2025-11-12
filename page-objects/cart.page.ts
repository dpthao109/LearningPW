import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  checkoutButton: Locator = this.page.getByRole("link", {
    name: "PROCEED TO CHECKOUT",
  });
  removeLink: Locator = this.page.getByRole("link", { name: "Remove" });

  rowItemLocator = (itemName: string): Locator => this.page.getByRole("row").filter({ hasText: itemName });

  constructor(private page: Page) {}

  async verifyItemInCart(itemName: string, numberOfItems?: number) {
    const itemInCart = this.page.getByRole("link", { name: itemName }).first();
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
      .filter({ hasText: itemName })
      .getByRole("link", { name: "Remove" });
    await removeButton.click();
  }

  async removeAllCart() {
    await this.page.waitForLoadState();
    if (await this.page.locator(".table-responsive").getByRole("table").isVisible()) {
      const removeLinkCount = this.removeLink.count();
      for (let i = 1; i <= (await removeLinkCount); i++) {
        await this.removeLink.first().click();
      }
    }
  }

  async verifyCartIsEmpty() {
    await expect(this.page.getByRole("heading", { name: "YOUR SHOPPING CART IS EMPTY" })).toBeVisible();
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
    }
  }

  async getPrice(itemName: string): Promise<number> {
    const priceText = await this.rowItemLocator(itemName).locator(".product-price").textContent();
    //return parseFloat(priceText.replace(/[^\d.-]/g, ""));
    return parseFloat((priceText ?? "").replace(/[^\d.-]/g, ""));
  }

  async getSubTotalNumber(itemName: string): Promise<number> {
    const subTotalText = await this.rowItemLocator(itemName).locator(".product-subtotal").textContent();
    const subTotal = (subTotalText ?? "").replace(/[^\d.-]/g, "");
    return parseFloat(subTotal);
  }

  async verifySubTotal(itemName: string, expectedTotal: number) {
    const expected = expectedTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const subTotalLocator = this.rowItemLocator(itemName).locator(".product-subtotal");
    await expect(subTotalLocator).toHaveText(`$${expected}.00`);
  }

  // async verifySubTotalNumber(itemName: string, expectedTotal: number) {
  //   const subTotal = await this.getSubTotalNumber(itemName);
  //   await expect(subTotal).toEqual(expectedTotal);
  // }
}

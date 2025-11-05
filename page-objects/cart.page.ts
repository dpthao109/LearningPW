import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  checkoutButton: Locator = this.page.getByRole("link", {
    name: "PROCEED TO CHECKOUT",
  });
  removeLink: Locator = this.page.getByRole("link", { name: "Remove" });

  constructor(private page: Page) {}

  async verifyItemInCart(itemName: string, numberOfItems?: number) {
    const itemInCart = this.page.getByRole("link", { name: itemName }).first();
    await expect(itemInCart).toBeVisible();
    if (numberOfItems) {
      const quantityLocator = this.page
        .getByRole("row")
        .filter({ hasText: itemName })
        .getByRole("spinbutton");
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
    const removeLinkCount = this.removeLink.count();
    for (let i = 1; i <= (await removeLinkCount); i++) {
      this.removeLink.first().click();
      await this.page.waitForTimeout(5000);
    }
  }

  async verifyCartIsEmpty() {
    await expect(
      this.page.getByRole("heading", { name: "YOUR SHOPPING CART IS EMPTY" })
    ).toBeVisible();
  }

  async updateItemQuantity(itemName: string, quantity: number) {
    const quantityLocator = this.page
      .getByRole("row")
      .filter({ hasText: itemName })
      .getByRole("spinbutton");
    await quantityLocator.fill(quantity.toString());
    // Click outside to trigger update
    await this.page.click("body");
    await this.page.waitForTimeout(3000);
  }

  async getItemQuantity(itemName: string): Promise<number> {
    const quantityLocator = this.page
      .getByRole("row")
      .filter({ hasText: itemName })
      .getByRole("spinbutton");
    const value = await quantityLocator.inputValue();
    return parseInt(value, 10);
  }

  async addItemQuantity(itemName: string, incrementBy: number) {
    await this.page.waitForTimeout(3000);
    for (let i = 0; i < incrementBy; i++) {
      await this.page
        .getByRole("row")
        .filter({ hasText: itemName })
        .locator(".plus")
        .click();
    }
  }

  async subtractItemQuantity(itemName: string, decrementBy: number) {
    await this.page.waitForTimeout(3000);
    for (let i = 0; i < decrementBy; i++) {
      await this.page
        .getByRole("row")
        .filter({ hasText: itemName })
        .locator(".minus")
        .click({ timeout: 5000 });
    }
  }

  async getSubTotalNumber(itemName: string): Promise<number> {
    await this.page.waitForTimeout(5000);
    const subTotalText = await this.page
      .getByRole("row")
      .filter({ hasText: itemName })
      .locator(".product-subtotal")
      .textContent();

    if (!subTotalText) {
      throw new Error(`Subtotal text not found for item: ${itemName}`);
    }
    const subTotal = subTotalText.replace(/[^\d.-]/g, "");
    return parseFloat(subTotal);
  }

  async verifySubTotal(itemName: string, expectedTotal: number) {
    const subTotal = await this.getSubTotalNumber(itemName);
    await expect(subTotal).toEqual(expectedTotal);
  }
}

import { expect, Locator, Page } from "@playwright/test";
import { CONFIG } from "utils/config";

export class HomePage {
  allDepartments: Locator = this.page.getByText("All Departments");
  gridButton: Locator = this.page.locator(".switch-grid");
  listButton: Locator = this.page.locator(".switch-list");
  cartLink: Locator = this.page
    .getByRole("link")
    .filter({ hasText: "$" })
    .getByRole("img")
    .first();
  accountLink: Locator = this.page.getByRole("link", { name: process.env.TEST_ACCOUNT! });

  constructor(private page: Page) {}

  async selectDepartment(nameDepartment: string) {
    await this.allDepartments.click();
    await this.page.getByRole("link", { name: nameDepartment }).first().click();
  }

  async selectMenuItem(menuItem: string) {
    const menu = this.page.getByRole("link", { name: menuItem }).first();
    await menu.click();
  }

  async switchView(view: string) {
    await this.page.waitForTimeout(2000);
    if (view === "Grid") {
      await expect(this.gridButton).toBeVisible();
      await this.gridButton.click();
    } else if (view === "List") {
      await expect(this.listButton).toBeVisible();
      await this.listButton.click();
    }
  }

  async verifyViewIs(view: string) {
    if (view === "List") {
      const productsList = this.page.locator(".products-list");
      await expect(productsList).toBeVisible();
    } else if (view === "Grid") {
      const productsGrid = this.page.locator(".products-grid");
      await expect(productsGrid).toBeVisible();
    }
  }

  async addItemToCart(itemName: string) {
    const item = this.page.getByRole("link", { name: itemName }).first();
    await item.click();
  }

  async gotoCart() {
    await this.cartLink.click();
    await this.page.reload();

  }

  async gotoAccount() {
    await this.accountLink.click();
  }
}

import { expect, Locator, Page } from "@playwright/test";
import { Common } from "utils/common";

export class HomePage {
  allDepartments: Locator = this.page.getByText("All Departments");
  gridButton: Locator = this.page.locator(".switch-grid");
  listButton: Locator = this.page.locator(".switch-list");
  cartLink: Locator = this.page.getByRole("link").filter({ hasText: "$" }).getByRole("img").first();
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

  async switchViewToList() {
    await expect(this.listButton).toBeVisible();
    await this.listButton.click();
  }

  async switchViewToGrid() {
    await expect(this.gridButton).toBeVisible();
    await this.gridButton.click();
  }

  async verifyViewIsList() {
    const productsList = this.page.locator(".products-list");
    await expect(productsList).toBeVisible();
  }

  async verifyViewIsGrid() {
    const productsGrid = this.page.locator(".products-grid");
    await expect(productsGrid).toBeVisible();
  }

  async addItemToCart(itemName: string) {
    const item = this.page.getByRole("link", { name: itemName }).first();
    await item.click();
  }

  async gotoCart() {
    await this.cartLink.click();
    await expect (this.page.getByRole("link", { name: "SHOPPING CART"})).toBeVisible();
  }

  async gotoAccount() {
    await this.accountLink.click();
  }
}

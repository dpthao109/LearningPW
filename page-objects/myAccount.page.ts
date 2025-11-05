import { expect, Locator, Page } from "@playwright/test";

export class MyAccountPage {
  logoutLink: Locator = this.page.getByRole("link", { name: "Log out" });
  recentOrdersLink: Locator = this.page
    .getByRole("link")
    .filter({ hasText: "Recent orders" });
  orderTable: Locator = this.page.locator("table.shop_table");

  constructor(private page: Page) {}
  async gotoRecentOrders() {
    await this.recentOrdersLink.click();
  }

  async verifyOrders(expectedCount: number) {
    const orderRows = this.orderTable.locator("tbody tr");
    const actualCount = await orderRows.count();
    await expect(actualCount).toBeGreaterThanOrEqual(expectedCount);
  }
}

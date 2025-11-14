import { Locator, Page } from "@playwright/test";
import { expect } from 'utils/fixtures';

export class MyAccountPage {
  logoutLink: Locator = this.page.getByRole("link", { name: "Log out" });
  recentOrdersLink: Locator = this.page.getByRole("link").filter({ hasText: "Recent orders" });
  orderTable: Locator = this.page.locator("table.shop_table");

  constructor(private page: Page) {}
  async gotoRecentOrders() {
    await this.recentOrdersLink.click();
  }

  async verifyOrders(expectedCount: number) {
    const orderRows = this.orderTable.locator("tbody tr");
    await expect(orderRows).toHaveAmountGreaterThanOrEqual(expectedCount);
  }
}

import { Locator, Page, expect } from "@playwright/test";

export class GeneralPage {
  constructor(private page: Page) {}
  loadingLocator: Locator = this.page.locator(".loading");

  async waitForLoadingToComplete() {
    await this.loadingLocator.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
    await expect(this.loadingLocator).toHaveCount(0);
  }
}

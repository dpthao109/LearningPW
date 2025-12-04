import { Locator, Page, expect } from "@playwright/test";
import { GeneralPage } from "./general.page";
import { Common } from "utils/common";

export class ShopPage {
  addToCartButton: Locator = this.page.getByRole("button", { name: "Add to cart" });
  reviewTab: Locator = this.page.getByRole("link").filter({ hasText: "REVIEWS" });
  descriptionTab: Locator = this.page.getByRole("link").filter({ hasText: "DESCRIPTION" });
  reviewText: Locator = this.page.getByRole("textbox", { name: "Your review *" });
  filterCombobox: Locator = this.page.locator('select[name="orderby"]');
  submitButton: Locator = this.page.getByRole("button", { name: "Submit" });
  priceLocator: Locator = this.page.locator(".product .price");
  itemCardLocator = (itemName: string): Locator => this.page.getByRole("link", { name: itemName, exact: true });

  generalPage = new GeneralPage(this.page);

  constructor(private page: Page) {}

  async addItems(itemName: string, quantity: number) {
    await this.itemCardLocator(itemName).click();
    if (quantity > 1) {
      const quantityInput = this.page.getByRole("spinbutton", { name: itemName + " quantity" });
      await quantityInput.fill(quantity.toString());
    }
    await expect(this.addToCartButton).toBeVisible();
    await this.addToCartButton.click();
    await this.generalPage.waitForLoadingToComplete();
    await this.page.goBack();
  }

  async buyMultipleItems(items: { name: string; quantity: number }[]) {
    for (const item of items) {
      await this.addItems(item.name, item.quantity);
    }
  }

  async filter(filterBy: string) {
    await this.generalPage.waitForLoadingToComplete();
    await this.filterCombobox.selectOption(filterBy);
    await this.generalPage.waitForLoadingToComplete();
  }

  async verifyItemsSortedByPrice(type: "ascending" | "descending") {
    await expect(this.priceLocator.first()).toBeVisible();
    const prices = await this.priceLocator.allTextContents();
    const priceValues = await Common.extractPriceValues(prices);
    let sortedPrices: number[];
    if (type === "ascending") {
      sortedPrices = await Common.sortNumbersAscending(priceValues);
    } else {
      sortedPrices = await Common.sortNumbersDescending(priceValues);
    }
    expect(priceValues).toEqual(sortedPrices);
  }

  async openItem(itemName: string) {
    await this.itemCardLocator(itemName).click();
  }

  async selectTab(tabItem: string) {
    if ((tabItem = "Review")) {
      await this.reviewTab.click();
    }
  }

  async submitReview(reviewContent: string, ratingStar: number) {
    const starClass = ".star-" + ratingStar;
    await this.reviewText.fill(reviewContent);
    await this.page.locator(starClass).click();
    await this.submitButton.click();
    await expect(this.descriptionTab).toHaveClass(/opened/);
  }

  async verifyReviewPosted(reviewContent: string, ratingStar: number) {
    const reviewLocator = this.page.locator(".comment-text").filter({ hasText: reviewContent });
    await expect(reviewLocator).toBeVisible();
    const ratingStarLocator = reviewLocator.getByRole("img", {
      name: `Rated ${ratingStar} out of 5`,
    });
    await expect(ratingStarLocator).toBeVisible();
  }
}

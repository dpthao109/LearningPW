import { expect, test } from "utils/fixtures";
import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";
import { Common } from "utils/common";

test("TC10 - users can post a review", async ({ page, loggedInPage }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);

  const productName = "AirPods";
  const randomNum = await Common.randomNumber(1, 1000);
  const reviewContent = `test review ${randomNum}`;
  const ratingStar = await Common.randomNumber(1, 5);

  //Go to Shop page
  await homePage.selectMenuItem("Shop");

  //Click on a product to view detail
  await shopPage.openItem(productName);

  //Scroll down then click on REVIEWS tab
  await shopPage.selectTab("Review");

  //Submit a review
  await shopPage.submitReview(reviewContent, ratingStar);

  //Verify new review
  await shopPage.verifyReviewPosted(reviewContent, ratingStar);
});

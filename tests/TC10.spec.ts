import { expect, test } from "utils/fixtures";
import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";

test("TC10 - users can post a review", async ({page,loggedInPage }) => 
{
    const homePage = new HomePage(page);
    const shopPage = new ShopPage(page);

    const productName = "AirPods";


      //Go to Shop page
  await homePage.selectMenuItem("Shop");

  //Click on a product to view detail
  await shopPage.openItem(productName)

  //Scroll down then click on REVIEWS tab
  await shopPage.selectTab("Review");

  //Submit a review
  await shopPage.submitReview("test review", 3);

  //Verify new review


});

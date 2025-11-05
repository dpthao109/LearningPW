import { HomePage } from "page-objects/home.page";
import { test, expect } from "utils/fixtures";
import { ShopPage } from "page-objects/shop.page";

test("TC04 - users can sort items by price", async ({ page, loggedInPage }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);

  //Go to Shop page
  await homePage.selectMenuItem("Shop");

  // Switch view to list
  await homePage.switchView("list");

  //Sort items by price (low to high / high to low)
  await shopPage.filter("Sort by price: high to low");

  //Verify the order of items
  await shopPage.verifyItemsSortedByPriceDescending();

  //Sort items by price (low to high / high to low)
  await shopPage.filter("Sort by price: low to high");

  //Verify the order of items
  await shopPage.verifyItemsSortedByPriceAscending();
});

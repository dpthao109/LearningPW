import { test } from "utils/fixtures";

test("TC04 - users can sort items by price", async ({ loggedInPage, homePage, shopPage }) => {

  //Go to Shop page
  await homePage.selectMenuItem("Shop");

  // Switch view to list
  await homePage.switchViewToList();

  //Sort items by price (low to high / high to low)
  await shopPage.filter("Sort by price: low to high");

  //Verify the order of items
  await shopPage.verifyItemsSortedByPriceAscending();

   //Sort items by price (low to high / high to low)
  await shopPage.filter("Sort by price: high to low");

  //Verify the order of items
  await shopPage.verifyItemsSortedByPriceDescending();
});

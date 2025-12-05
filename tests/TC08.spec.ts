import { test } from "utils/fixtures";

test.beforeEach("add items to cart", async ({ loggedInPage, homePage, shopPage, cartPage }) => {
  //User added the items into cart
  const productName = "AirPods";

  await homePage.gotoCart();
  await cartPage.removeAllCart();

  await homePage.selectMenuItem("Shop");
  await homePage.switchViewToList();
  await shopPage.addItems(productName, 2);
});

test("TC_08- -users can clear the cart", async ({ homePage, cartPage }) => {
  const productName = "AirPods";
  //Go to Shopping cart page
  await homePage.gotoCart();
  //Verify items show in table
  await cartPage.verifyItemInCart(productName, 2);
  //Click on Clear shopping cart
  await cartPage.removeAllCart();
  //Verify empty cart page displays
  await cartPage.verifyCartIsEmpty();
});

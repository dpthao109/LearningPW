import { HomePage } from "../page-objects/home.page";
import { ShopPage } from "../page-objects/shop.page";
import { CartPage } from "../page-objects/cart.page";
import { expect, test } from "utils/fixtures";

test.beforeEach("add items to cart", async ({ page, loggedInPage }) => {
  //User added the items into cart
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);
  const productName = "AirPods";

  await homePage.gotoCart();
  await cartPage.removeAllCart();

  await homePage.selectMenuItem("Shop");
  await homePage.switchView("List");
  await shopPage.addItems(productName, 2);
});

test("TC08- -users can clear the cart", async ({ page }) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);
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

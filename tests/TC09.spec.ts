import { expect, test } from "utils/fixtures";
import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";
import { CartPage } from "page-objects/cart.page";

test("TC09 - users can update quantity of product in cart", async ({
  page,
  loggedInPage,
}) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);

  const productName = "iPad Air 2";
  const productQuantity = 1;
  //
  //Go to Shop page
  await homePage.selectMenuItem("Shop");
  //Add a product
  await shopPage.addItems(productName, productQuantity);
  //Go to the cart
  await homePage.gotoCart();

  //Verify quantity of added product
  await cartPage.verifyItemInCart(productName, productQuantity);
  const price = await cartPage.getSubTotalNumber(productName);

  //Click on Plus(+) button
  await cartPage.addItemQuantity(productName, 1);

  //Verify quantity of product and SUB TOTAL price
  await cartPage.verifyItemInCart(productName, productQuantity + 1);
  await cartPage.verifySubTotal(productName, price * (productQuantity + 1));

  //Enter 4 into quantity textbox then click on UPDATE CART button
  await cartPage.updateItemQuantity(productName, 4);

  //Verify quantity of product is 4 and SUB TOTAL price
  await cartPage.verifyItemInCart(productName, 4);
  await cartPage.verifySubTotal(productName, price * 4);

  //Click on Minus(-) button
  await cartPage.subtractItemQuantity(productName, 1);

  //Verify quantity of product and SUB TOTAL price : 3 products
  await cartPage.verifyItemInCart(productName, 3);
  await cartPage.verifySubTotal(productName, price * 3);
});

test.afterEach("clear all cart", async ({ page }) => {
  // Clear the cart after each test
  const cartPage = new CartPage(page);
  await cartPage.removeAllCart();
});

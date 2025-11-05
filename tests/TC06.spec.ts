import { test, Page } from "@playwright/test";
import { Common } from "utils/common";
import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";
import { CartPage } from "page-objects/cart.page";
import { CheckOutPage } from "page-objects/checkOut.page";
import { CONFIG } from "utils/config";

test("TC06 - users try to buy an item without logging in", async ({ page }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);
  const checkOutPage = new CheckOutPage(page);

  const productName = "AirPods";
  const payMent = "Check payments";

  await Common.navigateToPage(page);

  //Navigate to 'Shop' or 'Products' section
  await homePage.selectMenuItem("Shop");
  await homePage.switchView("List");
  //Add a product to cart
  await shopPage.addItems(productName, 1);
  //Click on Cart button
  await homePage.gotoCart();

  //Proceed to complete order
  await cartPage.checkout();
  await checkOutPage.fillShippingDetails({
    firstName: CONFIG.Customer.FIRST_NAME,
    lastName: CONFIG.Customer.LAST_NAME,
    street: CONFIG.Customer.STREET,
    country: CONFIG.Customer.COUNTRY,
    city: CONFIG.Customer.CITY,
    zipCode: CONFIG.Customer.ZIP_CODE,
    phone: CONFIG.Customer.PHONE,
    email: CONFIG.Customer.EMAIL,
    payMentMethod: payMent,
  });
  await checkOutPage.placeOrder();
  await checkOutPage.verifyProductsInOrder(productName, 1);
});

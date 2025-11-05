import { CONFIG } from "utils/config";
import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";
import { CartPage } from "page-objects/cart.page";
import { CheckOutPage } from "page-objects/checkOut.page";
import { expect, test } from "utils/fixtures";

test("TC_02 : users can buy multiple item", async ({ page, loggedInPage }) => {
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);
  const checkOutPage = new CheckOutPage(page);

  //Go to Shop page
  await homePage.selectMenuItem("Shop");

  //Select multiple items and add to cart
  await shopPage.buyMultipleItems([
    { name: "AirPods", quantity: 2 },
    { name: "iPad Air 2", quantity: 3 },
    { name: "Robotic Arm Edge", quantity: 1 },
  ]);

  // Proceed to checkout and confirm order
  await homePage.gotoCart();
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
  });
  await checkOutPage.placeOrder();
  //Verify order confirmation message
  await checkOutPage.verifyMultipleProductsInOrder([
    { name: "AirPods", quantity: 2 },
    { name: "iPad Air 2", quantity: 3 },
    { name: "Robotic Arm Edge", quantity: 1 },
  ]);
});

import { CONFIG } from "utils/config";
import { test } from "utils/fixtures";

test("TC_02 : users can buy multiple item", async ({ loggedInPage, homePage, shopPage, cartPage, checkOutPage }) => {

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

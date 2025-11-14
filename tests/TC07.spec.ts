import { CONFIG } from "utils/config";
import {  test } from "utils/fixtures";

test.beforeEach("add item", async ({ loggedInPage, homePage,shopPage , cartPage  }) => {
  //User is at checkout
  const productName = "AirPods";

  await homePage.selectMenuItem("Shop");
  await homePage.switchViewToList();
  await shopPage.addItems(productName, 1);
  await homePage.gotoCart();
  await cartPage.checkout();
});

test("TC07 - Ensure proper error handling when mandatory fields are blank", async ({ checkOutPage }) => {

  //Leave mandatory fields (address, payment info) blank
  await checkOutPage.fillShippingDetails({
    firstName: CONFIG.Customer.FIRST_NAME,
    lastName: CONFIG.Customer.LAST_NAME,
    street: "",
    country: CONFIG.Customer.COUNTRY,
    city: CONFIG.Customer.CITY,
    zipCode: CONFIG.Customer.ZIP_CODE,
    phone: CONFIG.Customer.PHONE,
    email: "",
  });

  //Click 'Confirm Order'
  await checkOutPage.placeOrder();

  //Verify error messages
  await checkOutPage.verifyErrorMessage("Billing Street address is a required field.");
  await checkOutPage.verifyErrorMessage("Billing Email address is a required field.");
});

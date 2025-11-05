import { HomePage } from "page-objects/home.page";
import { ShopPage } from "page-objects/shop.page";
import { CartPage } from "page-objects/cart.page";
import { CheckOutPage } from "page-objects/checkOut.page";
import { CONFIG } from "utils/config";
import { expect, test } from "utils/fixtures";

test.beforeEach("add item", async ({ page, loggedInPage }) => {
  //User is at checkout
  const homePage = new HomePage(page);
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);

  const productName = "AirPods";

  await homePage.selectMenuItem("Shop");
  await homePage.switchView("List");
  await shopPage.addItems(productName, 1);
  await homePage.gotoCart();
  await cartPage.checkout();
});

test("TC07 - Ensure proper error handling when mandatory fields are blank", async ({
  page,
}) => {
  const checkOutPage = new CheckOutPage(page);

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
  await checkOutPage.verifyErrorMessage(
    "Billing Street address is a required field."
  );
  await checkOutPage.verifyErrorMessage(
    "Billing Email address is a required field."
  );
});

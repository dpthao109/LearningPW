import { test } from "utils/fixtures";
import { CONFIG } from "utils/config";

test.beforeEach("clear all cart", async ({ loggedInPage, cartPage, homePage }) => {
  // Clear the cart after each test
  await homePage.gotoCart();
  await cartPage.removeAllCart();
});

test("TC_01 : Users can buy an item successfully", async ({ page, loggedInPage, homePage, cartPage, checkOutPage }) => {
  const productName = "DJI Mavic Pro Camera Drone";

  await homePage.selectDepartment("Car Electronics");
  await homePage.switchViewToList();
  await homePage.verifyViewIsList();
  await homePage.addItemToCart(productName);
  await homePage.gotoCart();
  await cartPage.verifyItemInCart(productName);
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
  await checkOutPage.verifyOrderDetails({
    itemName: productName,
    name: CONFIG.Customer.FIRST_NAME + " " + CONFIG.Customer.LAST_NAME,
    street: CONFIG.Customer.STREET,
    city: CONFIG.Customer.CITY,
    zipCode: CONFIG.Customer.ZIP_CODE,
    phone: CONFIG.Customer.PHONE,
    email: CONFIG.Customer.EMAIL,
  });
});

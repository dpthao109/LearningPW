import { test, expect } from "utils/fixtures";
import { CONFIG } from "utils/config";

test.beforeEach("clear all cart", async ({ loggedInPage, cartPage, homePage }) => {
  // Clear the cart after each test
  await homePage.gotoCart();
  await cartPage.removeAllCart();
});

test("TC_03 :  users can buy an item using different payment methods", async ({
  homePage,
  shopPage,
  cartPage,
  checkOutPage,
}) => {
  const productName = "AirPods";
  const payMent = "Cash on delivery";
  //Go to Shop page
  await homePage.selectMenuItem("Shop");
  await homePage.switchViewToList();
  //Select an item and add to cart
  await shopPage.addItems(productName, 1);
  await homePage.gotoCart();
  //Go to Checkout page
  await cartPage.checkout();
  //Choose a different payment method (Direct bank transfer, Cash on delivery)
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
  // /Complete the payment process
  await checkOutPage.placeOrder();

  //Verify order confirmation message
  await checkOutPage.verifyOrderDetails({
    itemName: productName,
    name: CONFIG.Customer.FIRST_NAME + " " + CONFIG.Customer.LAST_NAME,
    street: CONFIG.Customer.STREET,
    city: CONFIG.Customer.CITY,
    zipCode: CONFIG.Customer.ZIP_CODE,
    phone: CONFIG.Customer.PHONE,
    email: CONFIG.Customer.EMAIL,
    payMentMethod: payMent,
  });
});

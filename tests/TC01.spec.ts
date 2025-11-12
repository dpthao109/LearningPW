import { expect, test } from "utils/fixtures";
import { CONFIG } from "utils/config";
import { HomePage } from "page-objects/home.page";
import { CartPage } from "page-objects/cart.page";
import { CheckOutPage } from "page-objects/checkOut.page";

test("TC_01 : users can buy an item successfully", async ({ page, loggedInPage }) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);
  const checkOutPage = new CheckOutPage(page);

  const productName = "DJI Mavic Pro Camera Drone";

  await homePage.selectDepartment("Car Electronics");
  await homePage.switchView("List");
  await homePage.verifyViewIs("List");
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

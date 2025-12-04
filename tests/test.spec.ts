import { test } from "utils/fixtures";
import { log } from "console";

test("test", async ({ loggedInPage, cartPage, homePage }) => {
  await homePage.gotoCart();

  const subtotal = await cartPage.getProductDetails("Bose SoundLink Mini", "Subtotal");
  log("Value = " + subtotal);
  const price = await cartPage.getProductDetails("Bose SoundLink Mini", "Price");
  log("Value = " + price);
  const quantity = await cartPage.getProductDetails("Bose SoundLink Mini", "Quantity");
  log("Quantity = " + quantity?.trim());

});

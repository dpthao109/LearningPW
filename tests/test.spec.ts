import { test } from "utils/fixtures";
import { log } from "console";

test("test", async ({ loggedInPage, cartPage, homePage }) => {
  await homePage.gotoCart();

  const subtotal = await cartPage.getProductSubtotal("Bose SoundLink Mini");
  log("Value = " + subtotal);
});

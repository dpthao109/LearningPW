import { test } from "utils/fixtures";
import { log } from "console";

test('test', async ({ loggedInPage, cartPage, homePage }) => {
    await homePage.gotoCart();
   log ("Row Index :" + await cartPage.getRowIndex("iPad Air 2"));

   log ("suB TOTAL : "+ await cartPage.getcolumnIndex("SUBTOTAL"));


})
import { test, expect } from "utils/fixtures";
import { MyAccountPage } from "page-objects/myAccount.page";

test("TC05 - orders appear in order history ", async ({ page, loggedInPage }) => {
  const accountPage = new MyAccountPage(page);
  // Click on Orders in left navigation
  await accountPage.gotoRecentOrders();
  //Verify order details
  await accountPage.verifyOrders(2);

  // Additional steps to complete the order and verify order history would go here
});

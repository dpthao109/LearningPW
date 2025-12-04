import { test } from "utils/fixtures";
import { MyAccountPage } from "page-objects/myAccount.page";

test("TC05 - orders appear in order history ", async ({ page, loggedInPage , homePage}) => {
  
  const accountPage = new MyAccountPage(page);

  homePage.gotoAccount();
  // Click on Orders in left navigation
  await accountPage.gotoRecentOrders();
  //Verify order details
  await accountPage.verifyOrders(2);
});

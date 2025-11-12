import { expect, Locator, Page } from "@playwright/test";
import { log } from "console";

export class CheckOutPage {
  placeOrderButton: Locator = this.page.getByRole("button", {
    name: "PLACE ORDER",
  });
  firstNameInput: Locator = this.page.getByRole("textbox", {
    name: "First Name",
  });
  lastNameInput: Locator = this.page.getByRole("textbox", {
    name: "Last Name",
  });
  countryInput: Locator = this.page.locator("select#billing_country");
  streetInput: Locator = this.page.getByRole("textbox", {
    name: "Street address *",
  });
  cityInput: Locator = this.page.getByRole("textbox", {
    name: "Town / City *",
  });
  zipCodeInput: Locator = this.page.getByRole("textbox", {
    name: "ZIP code *",
  });
  phoneInput: Locator = this.page.getByRole("textbox", { name: "Phone *" });
  emailInput: Locator = this.page.getByRole("textbox", {
    name: "Email address *",
  });
  orderConfirmation: Locator = this.page.locator(".woocommerce-thankyou-order-received");
  billingAddressSection: Locator = this.page.locator("woocommerce-customer-details");
  constructor(private page: Page) {}

  async fillShippingDetails(details: {
    firstName: string;
    lastName: string;
    street: string;
    country: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
    payMentMethod?: string;
  }) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.countryInput.selectOption(details.country);
    await this.streetInput.fill(details.street);
    await this.cityInput.fill(details.city);
    await this.zipCodeInput.fill(details.zipCode);
    await this.phoneInput.fill(details.phone);
    await this.emailInput.fill(details.email);
    if (details.payMentMethod) await this.page.getByRole("radio", { name: details.payMentMethod }).check();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState();
  }

  async verifyOrderDetails(orderDetails: {
    itemName: string;
    name: string;
    street: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
    payMentMethod?: string;
  }) {
    await expect(this.orderConfirmation).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByRole("link", { name: orderDetails.itemName })).toBeVisible();
    await expect(this.page.getByText(orderDetails.phone)).toBeVisible();
    await expect(this.page.getByRole("paragraph").filter({ hasText: orderDetails.email })).toBeVisible();
    await expect(this.page.getByText(orderDetails.name)).toBeVisible();
    await expect(this.page.getByText(orderDetails.street)).toBeVisible();
    await expect(this.page.getByText(orderDetails.city)).toBeVisible();
    if (orderDetails.payMentMethod)
      await expect(this.page.getByRole("cell", { name: orderDetails.payMentMethod })).toBeVisible();
  }

  async verifyProductsInOrder(itemName: string, quantity: number) {
    const items = this.page.getByRole("cell", {
      name: itemName + " × " + quantity,
    });
    await expect(items).toBeVisible();
  }

  async verifyMultipleProductsInOrder(items: { name: string; quantity: number }[]) {
    for (const item of items) {
      await this.verifyProductsInOrder(item.name, item.quantity);
    }
  }

  async getErrorMessages() {
    await expect(this.page.getByRole("alert")).toBeVisible({ timeout: 5000 });
    const errorMessages = this.page.getByRole("alert").locator("li");
    const messages = [];
    const count = await errorMessages.count();
    for (let i = 0; i < count; i++) {
      messages.push(await errorMessages.nth(i).textContent());
    }

    log("Count : " + count);
    log("messages : " + messages);
    return messages;
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.page.getByRole("alert").locator("li", { hasText: expectedMessage })).toBeVisible();
  }
}

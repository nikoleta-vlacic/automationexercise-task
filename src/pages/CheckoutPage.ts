import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly totalAmount: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.totalAmount = page
      .getByRole("row", { name: /Total Amount/ })
      .locator(".cart_total_price");
    this.placeOrderButton = page.getByRole("link", {
      name: "Place Order",
    });
  }

  async expectCheckoutPage() {
    await expect(this.page).toHaveURL(/\/checkout$/);
  }

  async expectTotalAmount(amount: string) {
    await expect(this.totalAmount).toHaveText(amount);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

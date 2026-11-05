import { Page, Locator, expect } from "@playwright/test";
import messages from "../data/messages.json";

export class AddedToCartModal {
  readonly dialog: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator(".modal-content", {
      hasText: messages.cart.addedTitle,
    });
    this.title = this.dialog.getByText(messages.cart.addedTitle, {
      exact: true,
    });
    this.body = this.dialog.getByText(messages.cart.addedBody);
    this.viewCartLink = this.dialog.getByRole("link", { name: "View Cart" });
    this.continueShoppingButton = this.dialog.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async waitUntilOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectMessage() {
    await expect(this.title).toBeVisible();
    await expect(this.body).toBeVisible();
    await expect(this.viewCartLink).toHaveAttribute("href", "/view_cart");
  }

  async viewCart() {
    await this.viewCartLink.click();
    await expect(this.page).toHaveURL(/\/view_cart/);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.dialog).toBeHidden();
  }
}

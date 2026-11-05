import { Page, Locator, expect } from "@playwright/test";
import messages from "../data/messages.json";

const parseRs = (text: string): number => Number(text.replace(/\D/g, ""));

export class CartPage {
  readonly rows: Locator;
  readonly emptyMessage: Locator;
  readonly emptyCartLink: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator("#cart_info_table tbody tr");
    this.emptyMessage = page.locator("p", {
      hasText: messages.cart.emptyCart,
    });
    this.emptyCartLink = this.emptyMessage.getByRole("link", {
      name: "here",
    });

    this.proceedToCheckoutButton = page
      .locator("a.check_out")
      .filter({ hasText: "Proceed To Checkout" });
  }

  row(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  async expectProduct(name: string, quantity: number) {
    const row = this.row(name);
    await expect(row).toHaveCount(1);
    await expect(row.locator(".cart_quantity")).toHaveText(String(quantity));

    const price = parseRs(await row.locator(".cart_price").innerText());
    const total = parseRs(await row.locator(".cart_total_price").innerText());
    expect(total, `total for "${name}"`).toBe(price * quantity);
  }

  async removeOnlyProduct(name: string) {
    const deleteLink = this.row(name).locator(".cart_quantity_delete");

    await expect(async () => {
      await deleteLink.click();
      await expect(this.emptyMessage).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  }

  async expectEmpty() {
    await expect(this.emptyMessage).toBeVisible();
    await expect(this.emptyMessage).toContainText(messages.cart.emptyCart);
    await expect(this.emptyCartLink).toHaveAttribute("href", "/products");
    await expect(this.rows).toHaveCount(0);
  }
  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}

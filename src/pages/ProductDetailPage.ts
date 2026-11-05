import { Page, Locator, expect } from "@playwright/test";
import { AddedToCartModal } from "./AddedToCartModal";

export class ProductDetailPage {
  readonly name: Locator;
  readonly category: Locator;
  readonly price: Locator;
  readonly availability: Locator;
  readonly brand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly addedModal: AddedToCartModal;

  constructor(private readonly page: Page) {
    const info = page.locator(".product-information");
    this.name = info.locator("h2");
    this.category = info.getByText(/^Category:/);
    this.price = info.locator("span span");
    this.availability = info.getByText(/Availability:/);
    this.brand = info.getByText(/Brand:/);
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = info.getByRole("button", { name: "Add to cart" });
    this.addedModal = new AddedToCartModal(page);
  }

  async expectDetailsVisible() {
    await expect(this.name).toBeVisible();
    await expect(this.category).toBeVisible();
    await expect(this.price).toContainText("Rs.");
    await expect(this.availability).toBeVisible();
    await expect(this.brand).toBeVisible();
  }
  async addToCart(quantity: number) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    await this.addedModal.waitUntilOpen();
  }

  async goToCart() {
    await this.addedModal.viewCart();
  }
}

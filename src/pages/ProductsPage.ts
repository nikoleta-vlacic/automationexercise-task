import { Page, Locator, expect } from "@playwright/test";
import { AddedToCartModal } from "./AddedToCartModal";

export class ProductsPage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedHeading: Locator;
  readonly productCards: Locator;
  readonly addedModal: AddedToCartModal;

  constructor(private readonly page: Page) {
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.searchedHeading = page.getByRole("heading", {
      name: "Searched Products",
    });
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.addedModal = new AddedToCartModal(page);
  }

  async open() {
    await this.page.goto("/products");
    await expect(this.productCards.first()).toBeVisible();
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.searchedHeading).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  async firstProductName(): Promise<string> {
    const name = await this.productCards
      .first()
      .locator(".productinfo p")
      .innerText();
    return name.trim();
  }

  async addProductToCart(index = 0): Promise<string> {
    const card = this.productCards.nth(index);
    const name = (await card.locator(".productinfo p").innerText()).trim();

    await card.hover();
    const addButton = card.locator(".product-overlay .add-to-cart");
    await expect(addButton).toBeVisible();
    await addButton.click();

    await this.addedModal.waitUntilOpen();
    return name;
  }

  async addFirstProductToCart(): Promise<string> {
    return this.addProductToCart(0);
  }

  async continueShopping() {
    await this.addedModal.continueShopping();
  }

  async openFirstProductDetails() {
    await this.productCards
      .first()
      .getByRole("link", { name: "View Product" })
      .click();
    await expect(this.page).toHaveURL(/\/product_details\/\d+/);
  }

  async goToCart() {
    await this.addedModal.viewCart();
  }
}

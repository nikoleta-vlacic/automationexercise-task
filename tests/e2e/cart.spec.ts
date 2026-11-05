import { test, expect } from "../../src/fixtures/e2e.fixtures";
import { ProductsPage } from "../../src/pages/ProductsPage";
import { ProductDetailPage } from "../../src/pages/ProductDetailPage";
import { CartPage } from "../../src/pages/CartPage";

test.describe("Cart", { tag: "@e2e" }, () => {
  test("product added from the list appears in the cart", async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await products.open();
    const name = await products.addProductToCart(0);
    await products.addedModal.expectMessage();
    await products.goToCart();

    await expect(cart.rows).toHaveCount(1);
    await cart.expectProduct(name, 1);
  });

  test("two different products are both in the cart with correct totals", async ({
    page,
  }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await products.open();
    const first = await products.addProductToCart(0);
    await products.continueShopping();
    const second = await products.addProductToCart(1);
    await products.goToCart();

    expect(first).not.toBe(second);
    await expect(cart.rows).toHaveCount(2);
    await cart.expectProduct(first, 1);
    await cart.expectProduct(second, 1);
  });

  test("quantity chosen on the product page is reflected in the cart", async ({
    page,
  }) => {
    const products = new ProductsPage(page);
    const details = new ProductDetailPage(page);
    const cart = new CartPage(page);

    await products.open();
    await products.openFirstProductDetails();
    const name = (await details.name.innerText()).trim();

    await details.addToCart(3);
    await details.goToCart();

    await cart.expectProduct(name, 3);
  });

  test("removing the only product empties the cart", async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);

    await products.open();
    const name = await products.addProductToCart(0);
    await products.goToCart();
    await cart.expectProduct(name, 1);

    await cart.removeOnlyProduct(name);

    await cart.expectEmpty();
  });
});

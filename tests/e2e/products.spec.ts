import { test, expect } from "../../src/fixtures/e2e.fixtures";
import { ProductsPage } from "../../src/pages/ProductsPage";
import { ProductDetailPage } from "../../src/pages/ProductDetailPage";

test.describe("Products", { tag: "@e2e" }, () => {
  test("opening a product from the list shows the same product", async ({
    page,
  }) => {
    const products = new ProductsPage(page);
    const details = new ProductDetailPage(page);

    await products.open();
    const listName = await products.firstProductName();
    await products.openFirstProductDetails();

    await expect(details.name).toHaveText(listName);
    await expect(details.price).toContainText("Rs.");
  });

  test("searched product can be added to the cart", async ({ page }) => {
    const products = new ProductsPage(page);

    await products.open();
    await products.search("top");
    const name = await products.addFirstProductToCart();
    await products.goToCart();

    await expect(page.locator("#cart_info_table")).toContainText(name);
  });
});

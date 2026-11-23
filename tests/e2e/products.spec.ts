import { test, expect } from "../../src/fixtures/e2e.fixtures";

test.describe("Products", { tag: "@e2e" }, () => {
  test("opening a product from the list shows the same product", async ({
    productsPage,
    productDetailPage
  }) => {
    
    await productsPage.open();
    const listName = await productsPage.firstProductName();
    await productsPage.openFirstProductDetails();

    await expect(productDetailPage.name).toHaveText(listName);
    await expect(productDetailPage.price).toContainText("Rs.");
  });

  test("searched product can be added to the cart", async ({ productsPage }) => {
    
    await productsPage.open();
    await productsPage.search("top");
    const product = await productsPage.addFirstProductToCart();
    await productsPage.goToCart();

    await expect(productsPage.cartInfoTable).toContainText(product.name);
  });
});

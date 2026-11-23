import { test, expect } from "../../src/fixtures/e2e.fixtures";

test.describe("Cart", { tag: "@e2e" }, () => {
  test("product added from the list appears in the cart", async ({ productsPage, cartPage }) => {
    
    await productsPage.open();
    const product = await productsPage.addProductToCart(0);
    await productsPage.addedModal.expectMessage();
    await productsPage.goToCart();

    await expect(cartPage.rows).toHaveCount(1);
    await cartPage.expectProduct(product.name, 1);
  });

  test("two different products are both in the cart", async ({
    productsPage, cartPage
  }) => {
   
    await productsPage.open();
    const first = await productsPage.addProductToCart(0);
    await productsPage.continueShopping();
    const second = await productsPage.addProductToCart(1);
    await productsPage.goToCart();

    expect(first.name).not.toBe(second.name);
    await expect(cartPage.rows).toHaveCount(2);
    await cartPage.expectProduct(first.name, 1);
    await cartPage.expectProduct(second.name, 1);
  });

  test("quantity chosen on the product page is reflected in the cart", async ({
    productsPage, productDetailPage, cartPage
  }) => {
    
    const quantity = 3;
    await productsPage.open();
    await productsPage.openFirstProductDetails();
    const name = await productDetailPage.getName();

    await productDetailPage.addToCart(quantity);
    await productDetailPage.goToCart();

    await cartPage.expectProduct(name, quantity);
  });

  test("removing the only product empties the cart", async ({ productsPage, cartPage }) => {
    
    await productsPage.open();
    const product = await productsPage.addProductToCart(0);
    await productsPage.goToCart();
    await cartPage.expectProduct(product.name, 1);
    await cartPage.removeOnlyProduct(product.name);
    await cartPage.expectEmpty();
  });
});

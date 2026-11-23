import { test, expect } from "../../src/fixtures/e2e.fixtures";
import { CartPage } from "../../src/pages/CartPage";
import { CheckoutPage } from "../../src/pages/CheckoutPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { ProductsPage } from "../../src/pages/ProductsPage";
import cardData from "../../src/data/cardData.json";
import purchaseData from "../../src/data/purchaseData.json";

test.describe("Purchase e2e flow", { tag: "@e2e" }, () => {
  test("new user registers, buys a product and logs out", async ({
    page,
    loginPage,
    signupPage,
    newUser,
    api,
  }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const payment = new PaymentPage(page);

    await test.step("register new user", async () => {
      await loginPage.open();
      await signupPage.registerThroughUI(newUser);
      await loginPage.expectLoggedInAs(newUser.name);

      const fetched = await api.getUserByEmail(newUser.email);
      expect(fetched.responseCode).toBe(200);
    });
    const product = await test.step("product is added to cart", async () => {
      await products.open();
      const added = await products.addProductToCart(purchaseData.productIndex);
      await products.addedModal.expectMessage();
      await products.goToCart();
      await cart.expectProduct(added.name, purchaseData.quantity);
      await cart.proceedToCheckout();
      return added;
    });

    await test.step("order is placed and checked out", async () => {
      await checkout.expectCheckoutPage();
      await checkout.expectTotalAmount(
        `Rs. ${product.price * purchaseData.quantity}`,
      );
      await checkout.placeOrder();
    });
    await test.step("payment is made and order is confirmed", async () => {
      await payment.expectPaymentPage();
      await payment.fillCardDetails(cardData);
      await payment.payAndConfirmOrder();
      await payment.expectOrderConfirmation();
    });
    await test.step("user is logged out", async () => {
      await loginPage.logout();
      await loginPage.expectLoggedOut();
    });
  });
});

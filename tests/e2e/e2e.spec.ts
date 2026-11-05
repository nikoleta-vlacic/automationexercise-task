import { test, expect } from "../../src/fixtures/e2e.fixtures";
import { CartPage } from "../../src/pages/CartPage";
import { CheckoutPage } from "../../src/pages/CheckoutPage";
import { PaymentPage } from "../../src/pages/PaymentPage";
import { ProductsPage } from "../../src/pages/ProductsPage";
import cardData from "../../src/data/cardData.json";
import { LoginPage } from "../../src/pages/LoginPage";

test.describe("Purchase e2e flow", { tag: "@e2e" }, () => {
  test("user can complete checkout and place an order", async ({
    page,
    newUser,
    api,
  }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const payment = new PaymentPage(page);
    const signupPage = new LoginPage(page);
    const loginPage = new LoginPage(page);

    await signupPage.open();
    await signupPage.startSignup(newUser.name, newUser.email);
    await signupPage.fillAccountDetails(newUser);
    await signupPage.submitAccount();
    await signupPage.expectAccountCreated();
    await signupPage.continueAfterRegistration(newUser.name);

    const fetched = await api.getUserByEmail(newUser.email);
    expect(fetched.responseCode).toBe(200);

    await products.open();
    const productName = await products.addProductToCart(2);
    await products.addedModal.expectMessage();

    await products.goToCart();
    await cart.expectProduct(productName, 1);

    await cart.proceedToCheckout();

    await checkout.expectCheckoutPage();
    await checkout.expectTotalAmount("Rs. 1000");

    await checkout.placeOrder();

    await payment.expectPaymentPage();

    await payment.fillCardDetails(cardData);

    await payment.payAndConfirmOrder();

    await payment.expectOrderConfirmation();

    await loginPage.logout();
    await loginPage.expectLoggedOut();
  });
});

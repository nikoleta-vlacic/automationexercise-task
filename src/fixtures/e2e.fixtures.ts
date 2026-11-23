import { test as apiTest, expect } from "./api.fixtures";
import { buildUser, TestUser } from "../api/userFactory";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";

export const test = apiTest.extend<{
  newUser: TestUser;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  productDetailPage: ProductDetailPage;
}>({
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adsbygoogle|pagead/,
      (route) => route.abort(),
    );
    await use(page);
  },
  newUser: async ({ api }, use) => {
    const newUser = buildUser();
    await use(newUser);
    await api.deleteAccount(newUser.email, newUser.password);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  productsPage: async ({ page }, use) => {
  await use(new ProductsPage(page));
},
cartPage: async ({ page }, use) => {
  await use(new CartPage(page));
},
productDetailPage: async ({ page }, use) => {
  await use(new ProductDetailPage(page));
},
});

export { expect };

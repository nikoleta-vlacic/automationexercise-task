import { test as apiTest, expect } from "./api.fixtures";
import { buildUser, TestUser } from "../api/userFactory";

export const test = apiTest.extend<{ newUser: TestUser }>({
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
});

export { expect };

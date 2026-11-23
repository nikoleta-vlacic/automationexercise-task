import { test, expect } from "../../src/fixtures/e2e.fixtures";
import userData from "../../src/data/userData.json";

test.describe("Login", { tag: "@e2e" }, () => {
  test("registered user can log in", async ({ loginPage, user }) => {
    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedInAs(user.name);
  });

  test("invalid password shows an error and user can not log in", async ({
    loginPage,
    user,
  }) => {
    await loginPage.open();
    await loginPage.login(user.email, userData.invalidLogin.password);
    await loginPage.expectLoginError();
    await loginPage.expectNotLoggedIn();
  });

  test("login form requires email and password", async ({
    page,
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login("", "");
    await loginPage.expectRequiredLoginFields();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Signup", { tag: "@e2e" }, () => {
  test("new user can register through the UI", async ({
    api,
    newUser,
    loginPage,
    signupPage,
  }) => {
    await loginPage.open();
    await signupPage.registerThroughUI(newUser);
    await loginPage.expectLoggedInAs(newUser.name);

    const fetched = await api.getUserByEmail(newUser.email);
    expect(fetched.responseCode).toBe(200);
    expect(fetched.body.user.email).toBe(newUser.email);
  });

  test("registration with an already used email is rejected", async ({
    loginPage,
    signupPage,
    user,
  }) => {
    await loginPage.open();
    await signupPage.startSignup("Another Name", user.email);
    await signupPage.expectExistingEmailError();
  });
});

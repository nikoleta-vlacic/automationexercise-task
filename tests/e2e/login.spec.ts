import { test, expect } from "../../src/fixtures/e2e.fixtures";
import { LoginPage } from "../../src/pages/LoginPage";
import userData from "../../src/data/userData.json";

test.describe("Login", { tag: "@e2e" }, () => {
  test("registered user can log in", async ({ page, user }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await loginPage.expectLoggedInAs(user.name);
  });

  test("wrong password shows an error and does not log in", async ({
    page,
    user,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(user.email, userData.invalidLogin.password);
    await loginPage.expectLoginError();
    await loginPage.expectNotLoggedIn();
  });

  test("login form requires email and password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login("", "");
    await loginPage.expectRequiredLoginFields();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("Signup", { tag: "@e2e" }, () => {
  test("new user can register through the UI", async ({
    page,
    api,
    newUser,
  }) => {
    const signupPage = new LoginPage(page);

    await signupPage.open();
    await signupPage.startSignup(newUser.name, newUser.email);
    await signupPage.fillAccountDetails(newUser);
    await signupPage.submitAccount();
    await signupPage.expectAccountCreated();
    await signupPage.continueAfterRegistration(newUser.name);

    const fetched = await api.getUserByEmail(newUser.email);
    expect(fetched.responseCode).toBe(200);
    expect(fetched.body.user.email).toBe(newUser.email);
  });

  test("registration with an already used email is rejected", async ({
    page,
    user,
  }) => {
    const signupPage = new LoginPage(page);

    await signupPage.open();
    await signupPage.startSignup("Another Name", user.email);

    await signupPage.expectExistingEmailError();
  });
});

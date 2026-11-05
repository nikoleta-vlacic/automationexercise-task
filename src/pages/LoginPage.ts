import { Page, Locator, expect } from "@playwright/test";
import { TestUser } from "../api/userFactory";
import messages from "../data/messages.json";

export class LoginPage {
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly heading: Locator;
  readonly errorMessage: Locator;
  readonly loggedInLabel: Locator;

  readonly signupHeading: Locator;
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;
  readonly existingEmailError: Locator;

  readonly accountInfoHeading: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;

  readonly accountCreatedBody: Locator;
  readonly accountCreatedInfo: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    // Login/logout locators
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.heading = page.getByRole("heading", {
      name: "Login to your account",
    });
    this.errorMessage = page.getByText(messages.login.incorrectCredentials);
    this.loggedInLabel = page.getByText(/Logged in as/);
    this.logoutLink = page.getByRole("link", {
      name: "Logout",
    });
    // Signup locators
    this.signupHeading = page.getByRole("heading", {
      name: "New User Signup!",
    });
    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    this.existingEmailError = page.getByText(messages.signup.existingEmail);

    // Account information locators
    this.accountInfoHeading = page.getByText("Enter Account Information");
    this.createAccountButton = page.locator('[data-qa="create-account"]');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.accountCreatedBody = page.getByText(
      messages.signup.accountCreatedBody,
    );
    this.accountCreatedInfo = page.getByText(
      messages.signup.accountCreatedInfo,
    );
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async open() {
    await this.page.goto("/login");
    await expect(this.heading).toBeVisible();
  }

  // Login actions and assertions
  async login(email: string, password: string) {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedInAs(name: string) {
    await expect(this.loggedInLabel).toContainText(name);
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectNotLoggedIn() {
    await expect(this.loggedInLabel).toHaveCount(0);
  }

  async expectRequiredLoginFields() {
    const emailIsMissing = await this.loginEmail.evaluate(
      (element: HTMLInputElement) => element.validity.valueMissing,
    );

    const passwordIsMissing = await this.loginPassword.evaluate(
      (element: HTMLInputElement) => element.validity.valueMissing,
    );

    expect(emailIsMissing).toBe(true);
    expect(passwordIsMissing).toBe(true);
  }
  async logout() {
    await this.logoutLink.click();
  }

  async expectLoggedOut() {
    await expect(this.loggedInLabel).toHaveCount(0);
    await expect(this.page).toHaveURL(/\/login$/);
  }

  // Signup actions and assertions
  async startSignup(name: string, email: string) {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async expectExistingEmailError() {
    await expect(this.existingEmailError).toBeVisible();
    await expect(this.page).toHaveURL(/\/signup$/);
  }

  // Account information actions and assertions
  async fillAccountDetails(user: TestUser) {
    await expect(this.accountInfoHeading).toBeVisible();

    await this.page
      .locator(`input[name="title"][value="${user.title}"]`)
      .check();

    await this.page.locator('[data-qa="password"]').fill(user.password);
    await this.page.locator('[data-qa="days"]').selectOption(user.birth_date);
    await this.page
      .locator('[data-qa="months"]')
      .selectOption(user.birth_month);
    await this.page.locator('[data-qa="years"]').selectOption(user.birth_year);

    await this.page.locator('[data-qa="first_name"]').fill(user.firstname);
    await this.page.locator('[data-qa="last_name"]').fill(user.lastname);
    await this.page.locator('[data-qa="company"]').fill(user.company);
    await this.page.locator('[data-qa="address"]').fill(user.address1);
    await this.page.locator('[data-qa="address2"]').fill(user.address2);
    await this.page.locator('[data-qa="country"]').selectOption(user.country);
    await this.page.locator('[data-qa="state"]').fill(user.state);
    await this.page.locator('[data-qa="city"]').fill(user.city);
    await this.page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await this.page
      .locator('[data-qa="mobile_number"]')
      .fill(user.mobile_number);
  }

  async submitAccount() {
    await this.createAccountButton.click();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedHeading).toHaveText(
      new RegExp(messages.signup.accountCreatedTitle, "i"),
    );
    await expect(this.accountCreatedBody).toBeVisible();
    await expect(this.accountCreatedInfo).toBeVisible();
  }
  async continueAfterRegistration(name: string) {
    await this.continueButton.click();
    await this.expectLoggedInAs(name);
  }
}

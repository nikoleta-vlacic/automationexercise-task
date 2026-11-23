import { Page, Locator, expect } from "@playwright/test";
import messages from "../data/messages.json";

export class LoginPage {
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly heading: Locator;
  readonly errorMessage: Locator;
  readonly loggedInLabel: Locator;

  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
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
  }

  async open() {
    await this.page.goto("/login");
    await expect(this.heading).toBeVisible();
  }

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
}

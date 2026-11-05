import { Page, Locator, expect } from "@playwright/test";
import messages from "../data/messages.json";

export class PaymentPage {
  readonly page: Page;

  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payButton: Locator;

  readonly orderPlacedMessage: Locator;
  readonly orderConfirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameOnCard = page.locator('[data-qa="name-on-card"]');
    this.cardNumber = page.locator('[data-qa="card-number"]');
    this.cvc = page.locator('[data-qa="cvc"]');
    this.expiryMonth = page.locator('[data-qa="expiry-month"]');
    this.expiryYear = page.locator('[data-qa="expiry-year"]');

    this.payButton = page.locator('[data-qa="pay-button"]');

    this.orderPlacedMessage = page.getByRole("heading", {
      name: messages.order.placed,
    });

    this.orderConfirmationMessage = page.getByText(
      messages.order.confirmation,
      { exact: true },
    );
  }

  async expectPaymentPage() {
    await expect(this.page).toHaveURL(/\/payment$/);
  }

  async fillCardDetails(cardData: {
    name: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }) {
    await this.nameOnCard.fill(cardData.name);
    await this.cardNumber.fill(cardData.cardNumber);
    await this.cvc.fill(cardData.cvc);
    await this.expiryMonth.fill(cardData.expiryMonth);
    await this.expiryYear.fill(cardData.expiryYear);
  }

  async payAndConfirmOrder() {
    await this.payButton.click();
  }

  async expectOrderConfirmation() {
    await expect(this.orderPlacedMessage).toBeVisible();
    await expect(this.orderConfirmationMessage).toBeVisible();
  }
}

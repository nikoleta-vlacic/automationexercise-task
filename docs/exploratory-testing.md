# Exploratory Testing Report

## Testing Charter

The exploratory session focused on testing boundary values, invalid
inputs, alternative user actions, and consistency of information across
different pages.

Areas explored: - Register/Login. - Shopping cart and product quantities. - Product
brands and category filters. - Checkout and order information. - Payment
form validation. - Account deletion and subsequent login.

## Exploratory Testing Activities and Observations

**Shopping Cart**

- Attempted to add a negative product quantity to the cart.
- Tested large quantities, including 150, 200, and higher values, to
  check quantity handling and total price calculations.
- Removed products from the cart and verified whether the total amount
  was recalculated correctly.
Focus: Boundary value validation, quantity handling, and calculation
accuracy.

**Product Listing and Filters**

- Tested brand filters on the Products page.
- Checked whether the displayed product count matched the actual
  number of products shown.
- Tested category filters and verified whether the correct products
  were displayed.
Focus: Filter functionality, data consistency, and product count
accuracy.

**Checkout**

- Verified whether the customer information displayed during checkout
  matched the registered account details.
- Explored the comment field and checked how the application handled
  entered comments.
- Attempted to place an order without entering payment information.
- Checked the navigation behavior when returning to the home page
  during the checkout process.
Focus: Data consistency, input handling, checkout validation, and
navigation.

**Payment**

- Entered an extremely long card number (100 digits).
- Tested invalid values for the expiry date and other payment fields.
- Checked whether the payment form validated the entered information
  before allowing the purchase to proceed.
Focus: Input validation, boundary values, and payment form behavior.

**Account Management**

- Used the Delete Account functionality to remove the registered
  account.
- Attempted to log in again using the same credentials after account
  deletion.
Focus: Account deletion permissions and authentication behavior
after account removal.

## Findings 

**Observation**: No Forgot Password or password recovery option is available on the login page.

Expected behavior: Users should have a way to reset their password if they forget their login credentials.

Risk: Users who forget their passwords may lose access to their accounts and may be unable to complete purchases.

Severity: Medium – Users cannot recover account access independently.

Priority: Medium – Password recovery is an important account management feature and should be considered.

**Observation**: The application allows a logged-in customer to delete their account, even when their shopping cart contains products.

Expected behavior: Account deletion should consider whether the user has active cart items or pending orders. Appropriate warnings or confirmation steps should be provided to prevent accidental data loss.

Risk: Deleting an account while the cart contains products may result in losing the selected products and cart information. If the user has an order in progress, there is also a potential risk of losing order-related information or disrupting order fulfillment.

Severity: High – Potential loss of customer data and disruption of the purchasing process.

Priority: High – This behavior should be reviewed to ensure that account deletion does not cause unintended data loss or affect existing orders

**Observation**: The payment form accepted invalid card details,
including a card number containing 100 digits, and allowed the purchase
flow to complete.

Expected behavior: The payment form should validate card details and
reject invalid input before attempting payment.

Risk: Incorrect input validation could allow invalid payment data to
reach the payment processing layer. It also prevents meaningful testing
of payment failure scenarios.

Severity: Medium -- The payment functionality appears to be
simulated, so this does not necessarily indicate a defect in a real
payment integration.

Priority: High -- Payment validation is an important part of the
checkout process and should be reviewed.

## Additional Quality Considerations

- Product quantity boundaries should be validated to prevent negative or unrealistic quantities.
- Cart totals should remain accurate after quantity changes and product removal.
- Product filters and displayed product counts should remain consistent.
- Checkout information should always match the registered customer details.
- The application should provide appropriate validation when attempting to place an order without payment information.
  
## Conclusion

The exploratory session focused on boundary conditions, invalid inputs,
account management, and consistency across the main e-commerce
workflows.

The session also covered cart calculations, product filtering, checkout
information, and navigation behavior to identify potential issues beyond
the predefined automated test scenarios.
# Test Strategy

## 1. Approach

My approach is risk-based. This is an e-commerce application, so I prioritise the flows where a failure costs a customer or revenue: account access, cart accuracy, checkout and payment.

The system under test is a public, shared demo site that I do not own. That shapes several decisions below: I treat its data and availability as outside my control, and I avoid anything that would put load or abuse on it.

## 2. Priorities

1. **Registration and authentication.** If users cannot create an account or log in, nothing else matters. Covered: registration, duplicate email, valid and invalid login, required fields, logout, account update and deletion.
2. **Cart.** The cart must reflect exactly what the user picked: right product, quantity, line total, and correct behaviour on removal.
3. **Checkout and order confirmation.** The highest-value journey. A single happy path is automated end to end.
4. **Catalogue, brands and search.** Lower business risk, but cheap to cover at API level and a good source of data-consistency checks.
5. **Payment handling.** Highest risk in a real shop, but not testable here.

## 3. API vs End-to-End

**Rule:** if a risk can be caught by calling the backend directly, it goes to the API suite. An E2E test earns its place only when the risk is in the integration between UI, session and a multi-step flow, or when the user-visible result is the point.

**API tests cover:**
- Account lifecycle: create, duplicate email rejected, update persisted, delete with a wrong password keeps the account, deleted account no longer exists.
- Authentication: valid and invalid credentials, missing parameters, unsupported HTTP methods.
- Data safety: account details do not expose the password.
- Catalogue invariants: product IDs are unique, every product's brand exists in the brands list, products are well-formed.
- Search: matching, case-insensitivity, no-match returns an empty list, missing parameter is a bad request, special characters do not leak internal errors.

**E2E tests cover:**
- Registration through the UI, ending logged in, with the result confirmed through the API.
- Login, wrong password, required-field validation, logout.
- Product details match the listing.
- Cart: add from the list, add several products, quantity chosen on the product page, remove.
- Checkout: one happy path from login to order confirmation.

Negative cases are deliberately not repeated in the UI when the API already covers them. For example, "unknown email" is tested once, at API level.

## 4. Risks, assumptions, constraints

**Risks**
- Registration or login failure blocks all users.
- Wrong prices, quantities or totals in the cart.
- Checkout failure or missing order confirmation.
- Undefined credential-change behaviour, which could lock users out or weaken account security.
- API clients that trust the HTTP status: this API reports many outcomes in the response body (`responseCode`) rather than in the HTTP status, so a client checking only the status can mistake a failure for success.

**Assumptions**
- The public site is shared and stateful: other people's data and traffic exist, and its behaviour can change without notice.
- The published API documentation is the contract. Where behaviour differs from it, I record a finding rather than adjust the test to pass.
- Payment is simulated, because the form accepted arbitrary card details.

**Constraints**
- No access to the backend, database or deployment, so test data is created and cleaned up only through the public API.
- No design specifications, so no visual verification.
- Chrome only.
- The application server was occasionally overloaded or unavailable during testing, which sometimes affected test execution and application responsiveness.


## 5. Not covered, and why

- **Payment failure scenarios.** Not testable here: the site accepts any card details.
- **Password change.** There is no documented endpoint for it. I tried `updateAccount` with a new password and it did not work as a password change, so I did not keep a test that asserts an undocumented capability. This is recorded as a finding with a recommendation: add a documented change-password operation that requires the current password.
- **Performance, load and stress.** This is a shared public demo; load testing it would be inappropriate, and the numbers would describe their hosting rather than the application.
- **Security testing beyond light checks.** I do not own the system, so there is no deep authentication or authorisation probing. Only non-intrusive checks are included: the password is not returned in responses, and special characters do not reveal internal errors.
- **Visual and responsive validation.** No design to compare against.
- **Cross-browser and mobile.** Chrome only, to keep the suite fast and stable at this size.

## 6. Key decisions

**Product data is verified through the API, not the UI.**
The product pages hold a large catalogue, and the API documentation covers it well: product list, brands list and product search. Checking every product through the UI would be slow, repetitive and no more informative. The API suite validates the data once, in bulk: every product is well-formed, IDs are unique, every product's brand exists in the brands list, and search behaves correctly for matches, no matches, different letter case and a missing parameter. The UI is used only for what the API cannot show: that the product a user opens matches the one they clicked, and that it can be added to the cart.

**Payment is not tested in depth, because the site does not validate it.**
The payment form accepts any card details and always completes the purchase. With no rejection, expiry or failure behaviour to observe, there is nothing meaningful to assert, and tests for failure scenarios would only describe behaviour that does not exist. I automated a single happy path through to the order confirmation and recorded the missing validation as a finding. On a real system this would be the first area to extend.

**Functionality over appearance.**
No design specifications (such as Figma files) were provided, so there is no reference to judge layout against. I therefore concentrated on behaviour: that actions work, data is correct and the user ends up in the right state. I did not verify the presence or position of every element on a page, because any such check would encode the current layout rather than an intended one, and would break on harmless changes.

## 7. With more time

- Add payment-failure, duplicate-submission and retry tests once the system can produce them.
- Contract tests for the API against its documentation, so drift is caught automatically.
- A cross-browser nightly run, and flaky-test tracking over time.
- A test environment I control, so cleanup is not limited to what the public API allows.
- Accessibility checks on the main flows.
- More negative scenarios; current coverage focuses on positive flows and the most likely failures.
- More resilient E2E locators and further flakiness reduction.
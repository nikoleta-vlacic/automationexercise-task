# Sokin Task – Playwright Test Suite

Automated API and end-to-end tests for [automationexercise.com](https://automationexercise.com), implemented with Playwright and TypeScript. The suite consists of 35 tests, categorised by tags and executed automatically in GitHub Actions on every push and pull request.

## Prerequisites

- Node.js 22 (the version used in CI)
- npm
- Google Chrome (the tests use `channel: "chrome"`)
- Internet access, as the tests run against a live public website

## Installation

```bash
npm ci
npx playwright install --with-deps chrome
```

## Configuration

The target URL is taken from the `BASE_URL` environment variable and defaults to `https://automationexercise.com` when it is unset or empty. For local overrides, create a `.env` file in the project root:

```env
BASE_URL=https://automationexercise.com
```

Notable settings in `playwright.config.ts`:

- **CI:** 1 worker and 2 retries, to reduce flakiness against a shared public site; `forbidOnly` prevents committed `test.only`.
- **Diagnostics:** trace, screenshot and video are retained on failure only.
- **Reporters:** `list` for console output and `html` for the report (`open: "never"`).

## Running the tests

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm test`         | Runs the full suite (API and E2E)        |
| `npm run test:api` | Runs tests tagged `@api`                 |
| `npm run test:e2e` | Runs tests tagged `@e2e`                 |
| `npm run lint`     | Type-checks the project (`tsc --noEmit`) |
| `npm run report`   | Opens the latest HTML report             |

## Test tagging

Tests are tagged to allow selective execution:

- `@api` – tests that exercise the HTTP API directly, without a browser UI.
- `@e2e` – tests that drive user flows through the browser.

Tags can be combined with Playwright's standard filters, for example `npx playwright test --grep-invert @e2e`. CI runs the whole suite in a single execution so that both categories are always covered and a single consolidated report is produced; the per-tag scripts are intended for local use and for splitting the pipeline if the suite grows.

## Reporting and diagnostics

An HTML report is generated in `playwright-report/` after each run. For failed tests it includes the trace, a screenshot and a video. In CI the report is uploaded as the `playwright-report` artifact (retained for 7 days), including when tests fail.

## CI/CD

The pipeline is defined in `.github/workflows/playwright.yml` and runs on every push and pull request to `main` or `master`:

1. Checkout and Node.js 22 setup with npm caching
2. `npm ci`
3. TypeScript type check
4. Chrome installation
5. Full test execution (`npm test`)
6. Upload of the HTML report

Further details:

- The workflow uses least-privilege permissions (`contents: read`), a 30-minute timeout, and concurrency control that cancels superseded runs on the same branch.
- The base URL is provided through the repository secret `BASE_URL` (Settings → Secrets and variables → Actions). If it is not set, the configuration falls back to the default URL.

## Assumptions

- The system under test is the public site and its API; no credentials or private environments are required.
- Tests are independent and safe to run in parallel.
- Chrome is the only target browser.

## Known risks

- **Flakiness:** the suite depends on a third-party public site (latency, ads, downtime). Retries and failure diagnostics mitigate this; tests that pass only on retry are marked as flaky in the report and should be investigated.
- **Security:** no credentials are stored in the repository, and `.env` must remain untracked. Traces and videos may contain request data, so artifact retention is kept short.

## Possible improvements

- Cross-browser projects (Firefox, WebKit) in a CI matrix
- Separate parallel CI jobs for API and E2E tests, with sharding if the suite grows
- Scheduled (nightly) runs and failure notifications
- ESLint with `eslint-plugin-playwright`, formatting and pre-commit hooks

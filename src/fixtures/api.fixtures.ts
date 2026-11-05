import { test as base, expect } from "@playwright/test";
import { ApiClient } from "../api/apiClient";
import { buildUser, TestUser } from "../api/userFactory";

export const test = base.extend<{ api: ApiClient; user: TestUser }>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  user: async ({ api }, use) => {
    const user = buildUser();
    const res = await api.createAccount(user);
    expect(res.responseCode, "setup: createAccount").toBe(201);

    await use(user);

    await api.deleteAccount(user.email, user.password);
  },
});

export { expect };

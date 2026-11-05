import { test, expect } from "../../src/fixtures/api.fixtures";
import { buildUser } from "../../src/api/userFactory";

test.describe("Auth API", { tag: "@api" }, () => {
  test("valid credentials are accepted", async ({ api, user }) => {
    const res = await api.verifyLogin({
      email: user.email,
      password: user.password,
    });

    expect(res.responseCode).toBe(200);
    expect(res.body.message).toBe("User exists!");
  });

  test("wrong password is rejected", async ({ api, user }) => {
    const res = await api.verifyLogin({
      email: user.email,
      password: "wrong-password",
    });

    expect(res.responseCode).toBe(404);
    expect(res.body.message).toBe("User not found!");
  });

  test("unknown email is rejected", async ({ api }) => {
    const res = await api.verifyLogin({
      email: "nobody-here@example.com",
      password: "whatever",
    });

    expect(res.responseCode).toBe(404);
  });

  test("missing password is a bad request", async ({ api, user }) => {
    const res = await api.verifyLogin({ email: user.email });

    expect(res.responseCode).toBe(400);
  });

  test("verifyLogin does not accept DELETE", async ({ api }) => {
    const res = await api.deleteWithMethod("delete");

    expect(res.responseCode).toBe(405);
  });
});

test.describe("Account lifecycle API", { tag: "@api" }, () => {
  test("duplicate email cannot be registered", async ({ api, user }) => {
    const res = await api.createAccount(user);

    expect(res.responseCode).toBe(400);
    expect(res.body.message).toBe("Email already exists!");
  });

  test("account update is persisted", async ({ api, user }) => {
    const res = await api.updateAccount({ ...user, city: "Updated City" });
    expect(res.responseCode).toBe(200);

    const fetched = await api.getUserByEmail(user.email);
    expect(fetched.body.user.city).toBe("Updated City");
  });

  test("account details do not expose the password", async ({ api, user }) => {
    const res = await api.getUserByEmail(user.email);

    expect(res.responseCode).toBe(200);
    expect(res.raw).not.toContain(user.password);
  });

  test("deleting with a wrong password keeps the account", async ({
    api,
    user,
  }) => {
    const res = await api.deleteAccount(user.email, "wrong-password");
    expect(res.responseCode).toBe(404);

    const stillThere = await api.getUserByEmail(user.email);
    expect(stillThere.responseCode).toBe(200);
  });

  test("deleted account no longer exists", async ({ api }) => {
    const u = buildUser();
    await api.createAccount(u);

    const res = await api.deleteAccount(u.email, u.password);
    expect(res.responseCode).toBe(200);

    const gone = await api.getUserByEmail(u.email);
    expect(gone.responseCode).toBe(404);
  });
});

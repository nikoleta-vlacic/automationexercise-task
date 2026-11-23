import { test, expect } from "../../src/fixtures/api.fixtures";
import { buildUser } from "../../src/api/userFactory";
import messages from "../../src/data/messages.json";
import userData from "../../src/data/userData.json";

test.describe("Auth API", { tag: "@api" }, () => {
  test("valid credentials are accepted", async ({ api, user }) => {
    const res = await api.verifyLogin({
      email: user.email,
      password: user.password,
    });

    expect(res.responseCode).toBe(200);
    expect(res.body.message).toBe(messages.body.userExists);
  });

  test("wrong password is rejected", async ({ api, user }) => {
    const res = await api.verifyLogin({
      email: user.email,
      password: userData.invalidLogin.password,
    });

    expect(res.responseCode).toBe(404);
    expect(res.body.message).toBe(messages.body.userNotFound);
  });

  test("unknown email is rejected", async ({ api }) => {
    const res = await api.verifyLogin({
      email: userData.invalidLogin.email,
      password: userData.invalidLogin.password,
    });

    expect(res.responseCode).toBe(404);
    expect(res.body.message).toBe(messages.body.userNotFound);
  });

  test("missing password is a bad request", async ({ api, user }) => {
    const res = await api.verifyLogin({ email: user.email });

    expect(res.responseCode).toBe(400);
    expect(res.body.message).toBe(messages.body.badRequest);
  });

  test("verifyLogin does not accept DELETE", async ({ api }) => {
    const res = await api.deleteWithMethod("delete");

    expect(res.responseCode).toBe(405);
    expect(res.body.message).toBe(messages.body.methodNotSupported);
  });
});

test.describe("Account lifecycle API", { tag: "@api" }, () => {
  test("duplicate email cannot be registered", async ({ api, user }) => {
    const res = await api.createAccount(user);

    expect(res.responseCode).toBe(400);
    expect(res.body.message).toBe(messages.body.emailExists);
  });

  test("account update is persisted", async ({ api, user }) => {
    const res = await api.updateAccount({ ...user, city: userData.updatedCity });
    expect(res.responseCode).toBe(200);
    expect(res.body.message).toBe(messages.body.updatedUser);
    const fetched = await api.getUserByEmail(user.email);
    expect(fetched.body.user.city).toBe(userData.updatedCity);  
  });


  test("deleting with a wrong password keeps the account", async ({
    api,
    user,
  }) => {
    const res = await api.deleteAccount(user.email, userData.invalidLogin.password);
    expect(res.responseCode).toBe(404);

    const stillThere = await api.getUserByEmail(user.email);
    expect(stillThere.responseCode).toBe(200);
  });

  test("deleted account no longer exists", async ({ api }) => {
    const user = buildUser();
    await api.createAccount(user);

    const res = await api.deleteAccount(user.email, user.password);
    expect(res.responseCode).toBe(200);
    expect(res.body.message).toBe(messages.body.deletedAccount);

    const deleted = await api.getUserByEmail(user.email);
    expect(deleted.responseCode).toBe(404);
  });
});

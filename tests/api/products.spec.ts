import { test, expect } from "../../src/fixtures/api.fixtures";
import messages from "../../src/data/messages.json";
import purchaseData from "../../src/data/purchaseData.json";
  
test.describe("Products catalog", { tag: "@api" }, () => {
  test("catalog is not empty and every product is well-formed", async ({
    api,
  }) => {
    const res = await api.getProducts();

    expect(res.responseCode).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);

    for (const p of res.body.products) {
      expect(p.id).toEqual(expect.any(Number));
      expect(p.name).toEqual(expect.any(String));
      expect(p.name.trim()).not.toBe("");
      expect(p.price).toMatch(/^Rs\.\s?\d+/);
      expect(p.brand).toEqual(expect.any(String));
      expect(p.category.category).toEqual(expect.any(String));
    }
  });

  test("product IDs are unique", async ({ api }) => {
    const { body } = await api.getProducts();
    const ids = body.products.map((p: { id: number }) => p.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

test.describe("Brands", { tag: "@api" }, () => {
  test("brands list is not empty and well-formed", async ({ api }) => {
    const res = await api.getBrands();

    expect(res.responseCode).toBe(200);
    expect(res.body.brands.length).toBeGreaterThan(0);
    for (const b of res.body.brands) {
      expect(b.brand).toEqual(expect.any(String));
    }
  });

  test("every product brand exists in the brands list", async ({ api }) => {
    const products = (await api.getProducts()).body.products;
    const brands = new Set(
      (await api.getBrands()).body.brands.map(
        (b: { brand: string }) => b.brand,
      ),
    );

    for (const p of products) {
      expect(brands, `brand "${p.brand}" of product ${p.id}`).toContain(
        p.brand,
      );
    }
  });
});

test.describe("Product search", { tag: "@api" }, () => {
  for (const term of purchaseData.valid) {
    test(`search for "${term}" returns products from the catalog`, async ({
      api,
    }) => {
      const catalog = (await api.getProducts()).body.products;
      const catalogIds = new Set(catalog.map((p: { id: number }) => p.id));

      const res = await api.searchProduct(term);

      expect(res.responseCode).toBe(200);
      expect(res.body.products.length).toBeGreaterThan(0);
      for (const p of res.body.products) {
        expect(catalogIds).toContain(p.id);
      }
    });
  }

  test("search without a match returns an empty list", async ({
    api,
  }) => {
    const res = await api.searchProduct(purchaseData.noMatch);

    expect(res.responseCode).toBe(200);
    expect(res.body.products).toHaveLength(0);
  });

  test("search without the search_product parameter is a bad request", async ({
    api,
  }) => {
    const res = await api.searchProduct();

    expect(res.responseCode).toBe(400);
    expect(res.body.message).toBe(messages.body.searchBadRequest);
  });

});

test.describe("Unsupported methods", { tag: "@api" }, () => {
  test("POST /productsList is not allowed", async ({ api }) => {
    const res = await api.postProducts();

    expect(res.responseCode).toBe(405);
    expect(res.body.message).toBe(messages.body.methodNotSupported);
  });

  test("PUT /brandsList is not allowed", async ({ api }) => {
    const res = await api.putBrands();

    expect(res.responseCode).toBe(405);
    expect(res.body.message).toBe(messages.body.methodNotSupported);
  });
});

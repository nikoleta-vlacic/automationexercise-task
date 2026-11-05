import { APIRequestContext, APIResponse } from "@playwright/test";
import { TestUser } from "./userFactory";

export interface ApiResult {
  httpStatus: number;
  responseCode: number;
  body: any;
  raw: string;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  private async parse(res: APIResponse): Promise<ApiResult> {
    const raw = await res.text();
    let body: any = {};
    try {
      body = JSON.parse(raw);
    } catch {}
    return {
      httpStatus: res.status(),
      responseCode: body.responseCode ?? res.status(),
      body,
      raw,
    };
  }

  async createAccount(user: TestUser) {
    return this.parse(
      await this.request.post("/api/createAccount", { form: { ...user } }),
    );
  }

  async deleteAccount(email: string, password: string) {
    return this.parse(
      await this.request.delete("/api/deleteAccount", {
        form: { email, password },
      }),
    );
  }

  async getUserByEmail(email: string) {
    return this.parse(
      await this.request.get("/api/getUserDetailByEmail", {
        params: { email },
      }),
    );
  }
  async getProducts() {
    return this.parse(await this.request.get("/api/productsList"));
  }

  async postProducts() {
    return this.parse(await this.request.post("/api/productsList"));
  }

  async getBrands() {
    return this.parse(await this.request.get("/api/brandsList"));
  }

  async putBrands() {
    return this.parse(await this.request.put("/api/brandsList"));
  }

  async searchProduct(term?: string) {
    const form: Record<string, string> =
      term === undefined ? {} : { search_product: term };
    return this.parse(await this.request.post("/api/searchProduct", { form }));
  }
  async verifyLogin(data: { email?: string; password?: string }) {
    return this.parse(
      await this.request.post("/api/verifyLogin", { form: data }),
    );
  }

  async updateAccount(user: TestUser) {
    return this.parse(
      await this.request.put("/api/updateAccount", { form: { ...user } }),
    );
  }

  async deleteWithMethod(method: "get" | "put" | "delete") {
    return this.parse(await this.request[method]("/api/verifyLogin"));
  }
}

import request from "supertest";
import app from "../../src/api";

describe("GET /v1/auth/user", () => {
  test("Deve retonar todos os usuarios do banco STATUS 200", async () => {
    const response = await request(app).get("/v1/auth/user").send();
    expect(response.statusCode).toBe(200);
  });
});

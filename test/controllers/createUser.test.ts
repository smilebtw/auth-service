import request from "supertest";
import app from "../../src/api";

describe("POST /v1/auth/create", () => {
  describe("Recebendo um request com username e password", () => {
    test("caso o usuário já exista no banco", async () => {
      const response = await request(app).post("/v1/auth/create").send({
        username: "testUser",
        password: "myPassword",
      });
      expect(response.statusCode).toBe(400);
    });

    test("caso falte informações na request", async () => {
      const bodyData = [{ username: "username" }, { password: "password" }, {}];
      for (const body of bodyData) {
        const response = await request(app).post("/v1/auth/create").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});

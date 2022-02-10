import request from "supertest";
import app from "../../src/api";

describe("POST /v1/auth/login", () => {
  describe("Recebendo um usuário e senha na request", () => {
    test("Caso forem válidos e constam no banco deve retornar o STATUS 200", async () => {
      const response = await request(app).post("/v1/auth/login").send({
        username: "pinto",
        password: "pinto",
      });
      expect(response.statusCode).toBe(200);
    });


    test("Caso forem válidos mas não constam no banco devem retornar o STATUS 404", async () => {
      const response = await request(app).post("/v1/auth/login").send({
        username: "djsaidjaios",
        password: "edwiohdawiudhawiudgwahdagdsao",
      });
      expect(response.statusCode).toBe(404);
    });

    test("Caso o usuário for válido mas a senha incorreta deve retornar STATUS 401", async () => {
      const response = await request(app).post("/v1/auth/login").send({
        username: "pinto",
        password: "edwiohdawiudhawiudgwahdagdsao",
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("Quando está faltando usuário ou senha request", () => {
    test("Deve receber como retorno o STATUS 400", async () => {
      const bodyData = [{ username: "username" }, { password: "password" }, {}];
      for (const body of bodyData) {
        const response = await request(app).post("/v1/auth/login").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});

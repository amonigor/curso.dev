import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmo.case@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response2.status).toBe(200);

      const respons2eBody = await response2.json();

      expect(respons2eBody).toEqual({
        id: respons2eBody.id,
        username: "MesmoCase",
        email: "mesmo.case@email.com",
        password: respons2eBody.password,
        created_at: respons2eBody.created_at,
        updated_at: respons2eBody.updated_at,
      });

      expect(uuidVersion(respons2eBody.id)).toBe(4);
      expect(Date.parse(respons2eBody.created_at)).not.toBeNaN();
      expect(Date.parse(respons2eBody.updated_at)).not.toBeNaN();
    });

    test("With exact case mismatch", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case.diferente@email.com",
          password: "senha123",
        }),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(response2.status).toBe(200);

      const respons2eBody = await response2.json();

      expect(respons2eBody).toEqual({
        id: respons2eBody.id,
        username: "CaseDiferente",
        email: "case.diferente@email.com",
        password: respons2eBody.password,
        created_at: respons2eBody.created_at,
        updated_at: respons2eBody.updated_at,
      });

      expect(uuidVersion(respons2eBody.id)).toBe(4);
      expect(Date.parse(respons2eBody.created_at)).not.toBeNaN();
      expect(Date.parse(respons2eBody.updated_at)).not.toBeNaN();
    });

    test("With nonexistent 'username'", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});

import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../../../src/index";

const api = request(app);

describe("/room", () => {
  describe("GET /room", () => {
    test("Should return 200", async () => {
      const { status, body } = await api.get("/api/v1/room");
      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("info");
      expect(body).toHaveProperty("results");
    });

    test("Should return 200 with query params", async () => {
      const { status, body } = await api.get("/api/v1/room?page=1&per_page=10");
      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("info");
      expect(body).toHaveProperty("results");
      expect(body.info.perPage).toBe(10);
      expect(body.info.page).toBe(1);
    });
  });

  describe("GET /room/:id", () => {
    test("Should return 200", async () => {
      const { status, body } = await api.get("/api/v1/room/1");
      expect(status).toBe(200);
      expect(body).toBeDefined();
      expect(body).toBeInstanceOf(Object);
    });
  });
});

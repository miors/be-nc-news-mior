const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const apiEndpoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => {
  return db.end();
});

describe("GET /api/users", () => {
  it("GET:200 should return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  it("GET:200 should return specific user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe("butter_bridge");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
        expect(user.name).toBe("jonny");
      });
  });

  it("GET:404 should return error when user is invalid", () => {
    return request(app)
      .get("/api/users/invalidUser")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Column cannot be null");
      });
  });
});

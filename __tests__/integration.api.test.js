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

describe("GET /api/topics", () => {
  it("GET:200 should send an array of topic objects to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });

  it("GET:404 should display error when route does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Not Found"));
  });
});

describe("GET /api", () => {
  it("GET:200 should send available API endpoints info", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(apiEndpoints);
      });
  });
});

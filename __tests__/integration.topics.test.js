const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
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
});

describe("POST /api/topics", () => {
  it("GET:200 should post successfully", () => {
    const topicJson = {
      slug: "topic name here",
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(topicJson)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic.slug).toBe("topic name here");
        expect(topic.description).toBe("description here");
      });
  });

  it("GET:200 should post successfully if description is absence", () => {
    const topicJson = {
      slug: "topic name here",
    };

    return request(app)
      .post("/api/topics")
      .send(topicJson)
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic.slug).toBe("topic name here");
        expect(topic.description).toBe(null);
        expect(topic.slug).toBe("topic name here");
      });
  });

  it("GET:404 should return error if slug is absence from passed body", () => {
    const topicJson = {
      description: "description here",
    };

    return request(app)
      .post("/api/topics")
      .send(topicJson)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Column cannot be null");
      });
  });
});

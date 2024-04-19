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

describe("DELETE /api/comments/:comment_id", () => {
  it("DELETE:204 should be able to delete comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  it("DELETE:404 send error if unable to delete comment due to valid comment_id which is not in DB", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Unable to delete comment");
      });
  });

  it("DELETE:400 send error if unable to delete comment due to invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalidID")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  it("PATCH:200 should respond with the updated comment when successful", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe(
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(comment.article_id).toBe(9);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(17);
        expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z");
      });
  });

  it("PATCH:200 should respond with the updated comment even with additional keys in request body", () => {
    const newVote = { inc_votes: 1, additional_key: 2 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.body).toBe(
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(comment.article_id).toBe(9);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(17);
        expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z");
      });
  });

  it("PATCH:404 should return error if valid comment_id but not presence on DB", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/9999")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comment found");
      });
  });

  it("PATCH:400 should return error if invalid comment_id is passed", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/invalidID")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });

  it("PATCH:400 should return error if invalid key is passed", () => {
    const newVote = { invalidKey: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Column cannot be null");
      });
  });

  it("PATCH:400 should return error if value is not a number", () => {
    const newVote = { inc_votes: "notANumber" };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

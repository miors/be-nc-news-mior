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

describe("GET /api/articles/:article_id", () => {
  it("GET:200 should send associated article that matches article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(Object.keys(article)).toHaveLength(8);
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  it("GET:404 should return error if valid ID but not presence on DB", () => {
    return request(app)
      .get("/api/articles/1234567")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found");
      });
  });

  it("GET:400 should return error if invalid ID", () => {
    return request(app)
      .get("/api/articles/invalidID")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  it("GET:200 should send all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(Object.keys(article)).toHaveLength(8);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  it("GET:200 should sort using created_at by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  it("GET:200 should filter the articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
        articles.forEach((article) => {
          expect(Object.keys(article)).toHaveLength(8);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  it("GET:200 should send empty array if topic query string has no match", () => {
    return request(app)
      .get("/api/articles?topic=noMatch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(0);
      });
  });

  it("GET:400 should return error if order query string value is invalid", () => {
    return request(app)
      .get("/api/articles?topic=mitch&order=invalidOrder")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });

  it("GET:400 should return error if sort_by query string value is invalid", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=invalidSortBy")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid query");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("GET: 200 should send all comments for an article in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  it("GET: 200 should return empty array when article_id is valid and presence but no comment is presence", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });

  it("GET:404 should return error if valid article_id but not presence on DB", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found");
      });
  });

  it("GET:400 should return error if invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalidArticleID/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("POST:201 should respond with posted message when successful", () => {
    const postJson = {
      username: "butter_bridge",
      body: "Hello, this is a comment",
    };

    return request(app)
      .post("/api/articles/9/comments")
      .send(postJson)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.article_id).toBe("number");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("Hello, this is a comment");
      });
  });

  it("POST:404 should return error if valid article_id but not presence on DB", () => {
    const postJson = {
      username: "butter_bridge",
      body: "Hello, this is a comment",
    };

    return request(app)
      .post("/api/articles/999999/comments")
      .send(postJson)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("ID not presence in DB");
      });
  });

  it("POST:400 should return error if invalid input", () => {
    const postJson = {
      username: "butter_bridge",
      body: "Hello, this is a comment",
    };

    return request(app)
      .post("/api/articles/invalidInput/comments")
      .send(postJson)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("PATCH:200 should respond with the updated article when successful", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(1);
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.title).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });

  it("PATCH:404 should return error if valid article_id but not presence on DB", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found");
      });
  });

  it("PATCH:400 should return error if invalid article_id is passed", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/invalidID")
      .send(newVote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
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

  it("GET:404 should display error when route does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body: { msg } }) => expect(msg).toBe("Not Found"));
  });
});

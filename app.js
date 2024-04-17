const express = require("express");
const app = express();
const topicController = require("./controllers/topics.controller");
const articleController = require("./controllers/articles.controller");
const commentController = require("./controllers/comments.controller");
const userController = require("./controllers/users.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

app.use(express.json());

app.get("/api/topics", topicController.getAllTopics);

app.get("/api", topicController.getAvailEndpoints);

app.get("/api/articles/:article_id", articleController.getArticleByID);

app.get("/api/articles", articleController.getAllArticles);

app.get(
  "/api/articles/:article_id/comments",
  commentController.getAllCommentsByArticleID
);

app.get("/api/users", userController.getAllUsers);

app.post(
  "/api/articles/:article_id/comments",
  commentController.addCommentToArticle
);

app.patch(
  "/api/articles/:article_id",
  articleController.modifyArticleByArticleID
);

app.delete(
  "/api/comments/:comment_id",
  commentController.removeCommentByCommentID
);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

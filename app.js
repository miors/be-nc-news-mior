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
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

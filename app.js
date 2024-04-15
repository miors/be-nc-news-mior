const express = require("express");
const app = express();
const topicController = require("./controllers/topics.controller");
const { handleCustomErrors } = require("./errors/index.js");

app.get("/api/topics", topicController.getAllTopics);

app.all("*", (res, req, next) => {
  next({ status: 404, msg: "Not Found" });
});

app.use(handleCustomErrors);

module.exports = app;

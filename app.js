const express = require("express");
const app = express();
const topicController = require("./controllers/topics.controller");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

app.use(express.json());

app.get("/api/topics", topicController.getAllTopics);

app.get("*", topicController.getUnknownEndpoint);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;

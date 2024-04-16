const express = require("express");
const app = express();
const topicController = require("./controllers/topics.controller");
const { handleCustomErrors } = require("./errors/index.js");

app.get("/api/topics", topicController.getAllTopics);

app.get("/api", topicController.getAvailEndpoints);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);

module.exports = app;

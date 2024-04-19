const topicRouter = require("express").Router();
const topicController = require("../controllers/topics.controller");

topicRouter.get("/", topicController.getAllTopics);

module.exports = topicRouter;

const topicRouter = require("express").Router();
const topicController = require("../controllers/topics.controller");

topicRouter.get("/", topicController.getAllTopics);

topicRouter.post("/", topicController.postNewTopic);

module.exports = topicRouter;

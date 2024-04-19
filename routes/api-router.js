const apiRouter = require("express").Router();
const topicController = require("../controllers/topics.controller");
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const userRouter = require("./user-router");
const commentRouter = require("./comment-router");

apiRouter.get("/", topicController.getAvailEndpoints);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;

const commentRouter = require("express").Router();
const commentController = require("../controllers/comments.controller");

// articleRouter.get("/", articleController.getAllArticles);

// articleRouter.get("/:article_id", articleController.getArticleByID);

commentRouter.delete(
  "/:comment_id",
  commentController.removeCommentByCommentID
);

module.exports = commentRouter;

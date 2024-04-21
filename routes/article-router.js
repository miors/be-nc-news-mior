const articleRouter = require("express").Router();
const articleController = require("../controllers/articles.controller");
const commentController = require("../controllers/comments.controller");

articleRouter.get("/", articleController.getAllArticles);
articleRouter.post("/", articleController.postArticle);

articleRouter.get("/:article_id", articleController.getArticleByID);

articleRouter.delete(
  "/:article_id",
  articleController.removeArticleByArticleID
);

articleRouter.get(
  "/:article_id/comments",
  commentController.getAllCommentsByArticleID
);

articleRouter.post(
  "/:article_id/comments",
  commentController.addCommentToArticle
);

articleRouter.patch("/:article_id", articleController.modifyArticleByArticleID);

module.exports = articleRouter;

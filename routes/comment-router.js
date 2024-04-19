const commentRouter = require("express").Router();
const commentController = require("../controllers/comments.controller");

commentRouter.delete(
  "/:comment_id",
  commentController.removeCommentByCommentID
);

commentRouter.patch("/:comment_id", commentController.modifyCommentByCommentID);

module.exports = commentRouter;

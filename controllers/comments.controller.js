const commentModel = require("../models/comments.model");
const articleModel = require("../models/articles.model");

exports.getAllCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  return Promise.all([
    commentModel.fetchAllCommentsByArticleID(article_id, limit, p),
    articleModel.checkArticleExists(article_id),
  ])
    .then(([comments, existOrNot]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const body = req.body;
  const { article_id } = req.params;
  commentModel
    .insertCommentToArticle(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.removeCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  commentModel
    .deleteCommentByCommentID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.modifyCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  commentModel
    .updateCommentByCommentID(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

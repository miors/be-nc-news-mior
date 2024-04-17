const {
  fetchAllCommentsByArticleID,
  insertCommentToArticle,
  deleteCommentByCommentID,
} = require("../models/comments.model");
const { checkArticleExists } = require("../models/articles.model");

exports.getAllCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;

  return Promise.all([
    fetchAllCommentsByArticleID(article_id),
    checkArticleExists(article_id),
  ])
    .then(([comments, existOrNot]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticle = (req, res, next) => {
  const body = req.body;
  const { article_id } = req.params;
  insertCommentToArticle(article_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.removeCommentByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByCommentID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
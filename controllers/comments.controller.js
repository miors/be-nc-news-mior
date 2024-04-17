const { fetchAllCommentsByArticleID } = require("../models/comments.model");
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

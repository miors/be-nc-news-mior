const articleModel = require("../models/articles.model");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  articleModel
    .fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;
  articleModel
    .fetchAllArticles(topic, order, sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.modifyArticleByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  articleModel
    .updateArticleByArticleID(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

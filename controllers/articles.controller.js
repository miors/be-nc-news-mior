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
  const { topic, order, sort_by, limit, p } = req.query;
  const promisesArr = [
    articleModel.fetchAllArticles(topic, order, sort_by, limit, p),
    articleModel.totalCount(topic),
  ];

  return Promise.all(promisesArr)
    .then(([articles, { total_count }]) => {
      {
        res.status(200).send({ articles, total_count });
      }
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

exports.postArticle = (req, res, next) => {
  const body = req.body;
  articleModel
    .addArticle(body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return rows[0];
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM 
      articles LEFT JOIN comments ON articles.article_id  = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `SELECT title, topic, articles.author, articles.article_id, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return rows[0];
    });
};

exports.fetchAllArticles = (topic, order = "desc", sort_by = "created_at") => {
  const capitalCaseOrder = order.toUpperCase();
  const validOrdersArr = ["ASC", "DESC"];
  const validSortBysArr = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (
    !validSortBysArr.includes(sort_by) ||
    !validOrdersArr.includes(capitalCaseOrder)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const finalSqlArr = [];
  let finalSqlStr = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id  = comments.article_id
  `;

  if (topic) {
    finalSqlStr += " WHERE topic=$1";
    finalSqlArr.push(topic);
  }

  finalSqlStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${capitalCaseOrder};`;

  return db.query(finalSqlStr, finalSqlArr).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
    });
};

exports.updateArticleByArticleID = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes=(SELECT votes FROM articles WHERE article_id=$1)+$2 WHERE article_id=$1 RETURNING *`,
      [article_id, inc_votes]
    )
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return articles[0];
    });
};

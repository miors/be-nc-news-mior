const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllCommentsByArticleID = (article_id) => {
  return db
    .query(
      `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM articles INNER JOIN comments on articles.article_id = comments.article_id WHERE articles.article_id=$1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentToArticle = (article_id, body) => {
  return db
    .query(
      `INSERT INTO comments (body, article_id, author)
  VALUES ($1, $2, $3) returning *;`,
      [body.body, article_id, body.username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

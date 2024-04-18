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
  if (!body.body) {
    return Promise.reject({ status: 400, msg: "Comment is empty" });
  }
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

exports.deleteCommentByCommentID = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 returning *`, [comment_id])
    .then(({ rows: deleted_comments }) => {
      if (deleted_comments.length === 1) {
        return Promise.resolve();
      } else {
        return Promise.reject({ status: 404, msg: "Unable to delete comment" });
      }
    });
};

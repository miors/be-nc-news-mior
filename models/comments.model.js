const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllCommentsByArticleID = (article_id, limit = 10, p) => {
  if (p === undefined) {
    p = 1;
  }

  if (
    (limit && Number.isNaN(Number(limit))) ||
    (p && Number.isNaN(Number(p)))
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let variablePosition = 1;
  const finalSqlArr = [];
  let finalSqlStr = `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM articles INNER JOIN comments on articles.article_id = comments.article_id`;

  if (article_id) {
    finalSqlStr += ` WHERE articles.article_id=$${variablePosition++}`;
    finalSqlArr.push(article_id);
  }

  finalSqlStr += ` ORDER BY created_at DESC`;

  if (limit) {
    finalSqlStr += ` LIMIT $${variablePosition++}`;
    finalSqlArr.push(Number(limit));
  }

  if (p) {
    const offset = (p - 1) * limit;
    finalSqlStr += ` OFFSET $${variablePosition++};`;
    finalSqlArr.push(Number(offset));
  }

  return db.query(finalSqlStr, finalSqlArr).then(({ rows }) => {
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
      if (deleted_comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Unable to delete comment" });
      }
    });
};

exports.updateCommentByCommentID = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes=(SELECT votes FROM comments WHERE comment_id=$1)+$2 WHERE comment_id=$1 RETURNING *`,
      [comment_id, inc_votes]
    )
    .then(({ rows: updated_comments }) => {
      if (updated_comments.length === 0) {
        return Promise.reject({ status: 404, msg: "No comment found" });
      }
      return updated_comments[0];
    });
};

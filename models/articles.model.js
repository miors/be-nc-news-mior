const db = require("../db/connection");
const queries = require("../db/queries");
const format = require("pg-format");

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

exports.fetchAllArticles = (
  topic,
  order = "desc",
  sort_by = "created_at",
  limit = 10,
  p
) => {
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

  if (p === undefined) {
    p = 1;
  }

  if (
    !validSortBysArr.includes(sort_by) ||
    !validOrdersArr.includes(capitalCaseOrder) ||
    (limit && Number.isNaN(Number(limit))) ||
    (p && Number.isNaN(Number(p)))
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let variablePosition = 1;
  const finalSqlArr = [];
  let finalSqlStr = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id  = comments.article_id
  `;

  if (topic) {
    finalSqlStr += ` WHERE topic=$${variablePosition++}`;
    finalSqlArr.push(topic);
  }

  finalSqlStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${capitalCaseOrder}`;

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

exports.totalCount = (topic) => {
  const finalSqlArr = [];
  let finalSqlStr = `SELECT COUNT(article_id)::int AS total_count
  FROM articles`;

  if (topic) {
    finalSqlStr += ` WHERE topic = $1`;
    finalSqlArr.push(topic);
  }

  return db.query(finalSqlStr, finalSqlArr).then(({ rows }) => {
    return rows[0];
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
    .then(({ rows: updated_articles }) => {
      if (updated_articles.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return updated_articles[0];
    });
};

exports.addArticle = (body) => {
  const addArticleInsertQuery = format(
    `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES %L RETURNING *;`,
    [[body.title, body.topic, body.author, body.body, body.article_img_url]]
  );
  return db
    .query(addArticleInsertQuery)
    .then(({ rows: inserted_article }) => {
      const article_id = inserted_article[0].article_id;
      return db.query(
        `SELECT articles.author, title, articles.body, topic, article_img_url, articles.article_id, articles.votes, articles.created_at, COUNT(comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id  = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
        [article_id]
      );
    })
    .then(({ rows: articles_with_comment_count }) => {
      return articles_with_comment_count[0];
    });
};

exports.deleteArticleByArticleID = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id=$1`, [article_id])
    .then(() => {
      return db.query(`DELETE FROM articles WHERE article_id=$1 RETURNING *`, [
        article_id,
      ]);
    })
    .then(({ rows: deleted_articles }) => {
      if (deleted_articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Unable to delete article" });
      }
    });
};

const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllTopics = () => {
  return db.query(queries.selectAllTopics).then(({ rows }) => {
    return rows;
  });
};

exports.addNewTopic = (slug, descriptiom) => {
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) returning *;`,
      [slug, descriptiom]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

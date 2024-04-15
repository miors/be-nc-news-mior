const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllTopics = () => {
  return db.query(queries.selectAllTopics).then(({ rows }) => {
    return rows;
  });
};

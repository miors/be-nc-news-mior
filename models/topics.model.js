const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllTopics = () => {
  return db.query(queries.selectAllTopics).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUnknownEndpoint = () => {
  return Promise.reject({
    status: 404,
    msg: "Not Found",
  });
};

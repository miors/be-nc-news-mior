const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows: users }) => {
      return users;
    });
};

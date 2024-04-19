const db = require("../db/connection");
const queries = require("../db/queries");

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows: users }) => {
      return users;
    });
};

exports.fetchUserByUserID = (username) => {
  return db
    .query(`SELECT username, name, avatar_url FROM users WHERE username=$1;`, [
      username,
    ])
    .then(({ rows: users }) => {
      if (users.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid user" });
      }
      return users[0];
    });
};

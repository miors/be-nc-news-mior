const userModel = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  userModel
    .fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUserID = (req, res, next) => {
  const { username } = req.params;
  userModel
    .fetchUserByUserID(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

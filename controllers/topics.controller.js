const {
  fetchAllTopics,
  fetchUnknownEndpoint,
} = require("../models/topics.model");
exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getUnknownEndpoint = (req, res, next) => {
  fetchUnknownEndpoint()
    .then(() => {})
    .catch(next);
};

const topicModel = require("../models/topics.model");
const endpoints = require("../endpoints.json");

exports.getAllTopics = (req, res, next) => {
  topicModel
    .fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAvailEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

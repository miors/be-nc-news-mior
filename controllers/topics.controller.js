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

exports.postNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  topicModel
    .addNewTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.getAvailEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

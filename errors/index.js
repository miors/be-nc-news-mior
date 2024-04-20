exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "PSQL syntax error" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Column cannot be null" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "ID not presence in DB" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Errorrrrrr" });
};

exports.psqlErrors = (err, req, res, next) => {
  next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
  next(err);
};

exports.getNonExistentPathError = (req, res, next) => {
  res.status(404).send({ msg: "path does not exist" });
};

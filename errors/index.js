/// ERROR HANDLERS

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400s = (err, req, res, next) => {
  if (err.code === '22P02') res.status(400).send({ msg: 'Bad request!' });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal server error!' });
};

/// CONTROLLERS

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed!' });
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found!' });
};

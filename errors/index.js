/// ERROR HANDLERS

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psql400s = ['22P02', '23502', '42703'];
  const psql422s = ['23503'];
  if (psql400s.includes(err.code)) {
    res.status(400).send({ msg: 'Bad request!' });
  } else if (psql422s.includes(err.code)) {
    res.status(422).send({ msg: 'Unprocessable entity!' });
  } else next(err);
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

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed!' });
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: 'Path not found!' });
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal server error!' });
};

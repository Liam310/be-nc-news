const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle404s,
  handle500s
} = require('./errors/index');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.all('/*', handle404s);

app.use(handle500s);

module.exports = app;

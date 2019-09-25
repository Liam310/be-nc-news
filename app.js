const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handleCustomErrors,
  handle400s,
  handle404s,
  handle500s
} = require('./errors/index');

app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);
app.use(handle400s);

app.all('/*', handle404s);

app.use(handle500s);

module.exports = app;

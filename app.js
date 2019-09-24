const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { handleCustomErrors, handle404s, handle500s } = require('./errors/index');

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.all('/*', handle404s);

app.use(handle500s);

module.exports = app;

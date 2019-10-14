const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handleCustomErrors,
  handlePsqlErrors,
  handle404s,
  handle500s
} = require('./errors/index');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());

// Controllers
app.use('/api', apiRouter);
app.all('/*', handle404s);

// Error handlers
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;

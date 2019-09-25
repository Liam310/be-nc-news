const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/users');
const { handle405s } = require('../errors/index');

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .all(handle405s);

module.exports = usersRouter;

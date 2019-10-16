const usersRouter = require('express').Router();
const { sendUserByUsername, sendUsers } = require('../controllers/users');
const { handle405s } = require('../errors/index');

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .all(handle405s);

usersRouter
  .route('/')
  .get(sendUsers)
  .all(handle405s);

module.exports = usersRouter;

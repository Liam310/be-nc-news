const commentsRouter = require('express').Router();
const { updateComment } = require('../controllers/comments');
const { handle405s } = require('../errors/index');

commentsRouter
  .route('/:comment_id')
  .patch(updateComment)
  .all(handle405s);

module.exports = commentsRouter;

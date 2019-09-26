const commentsRouter = require('express').Router();
const { updateComment, removeComment } = require('../controllers/comments');
const { handle405s } = require('../errors/index');

commentsRouter
  .route('/:comment_id')
  .patch(updateComment)
  .delete(removeComment)
  .all(handle405s);

module.exports = commentsRouter;

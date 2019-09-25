const articlesRouter = require('express').Router();
const {
  sendArticleById,
  updateArticle,
  sendArticles
} = require('../controllers/articles');
const { postComment } = require('../controllers/comments');
const { handle405s } = require('../errors/index');

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(updateArticle)
  .all(handle405s);

articlesRouter.route('/').get(sendArticles);

module.exports = articlesRouter;
